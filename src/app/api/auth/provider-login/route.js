import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    const healthIdUrl = process.env.HEALTH_ID_URL || 'https://uat-moph.id.th';
    const providerIdUrl = process.env.PROVIDER_ID_URL || 'https://uat-provider.id.th';
    
    const healthClientId = process.env.HEALTH_CLIENT_ID || process.env.PROVIDER_CLIENT_ID;
    const healthClientSecret = process.env.HEALTH_CLIENT_SECRET || process.env.PROVIDER_CLIENT_SECRET;
    
    const providerClientId = process.env.PROVIDER_CLIENT_ID;
    const providerClientSecret = process.env.PROVIDER_CLIENT_SECRET;
    
    const redirectUri = process.env.PROVIDER_REDIRECT_URI || 'http://localhost:5177/';

    // Mock mode activation if credentials are not configured or if using a mock- prefix
    const isMockMode = (!healthClientId && !providerClientId) || 
                       (healthClientId === 'your_health_client_id_here') || 
                       (providerClientId === 'your_provider_client_id_here') || 
                       code.startsWith('mock-');

    let providerProfileData = null;

    if (isMockMode) {
      console.log('ProviderID login running in Mock Mode');
      // Return mock provider data for local testing/demo
      providerProfileData = {
        account_id: "5449999999999",
        hash_cid: "7a5635c12063210ec4cb9ea689709541a0d474890e38813e78c566e09f8f6aa7",
        provider_id: "0111111111X21",
        special_title_th: "นายแพทย์",
        name_th: "หมอพร้อม สงบสุข (ทดสอบ)",
        firstname_th: "หมอพร้อม",
        lastname_th: "สงบสุข",
        organization: [
          {
            position: "แพทย์",
            license_id: "D9999", // maps to mock doctor code
            hcode: "10665",
            hname_th: "โรงพยาบาลทดสอบ"
          }
        ]
      };
    } else {
      // 1. Exchange code for Health ID Access Token
      const tokenUrl = `${healthIdUrl}/api/v1/token`;
      const tokenParams = new URLSearchParams();
      tokenParams.set('grant_type', 'authorization_code');
      tokenParams.set('code', code);
      tokenParams.set('redirect_uri', redirectUri);
      tokenParams.set('client_id', healthClientId);
      tokenParams.set('client_secret', healthClientSecret);

      console.log('Exchanging authorization code with Health ID at:', tokenUrl);
      const healthIdTokenRes = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: tokenParams.toString(),
      });

      const healthIdTokenData = await healthIdTokenRes.json();
      if (!healthIdTokenRes.ok) {
        console.error('Health ID Token Exchange Error:', healthIdTokenData);
        return NextResponse.json(
          { error: healthIdTokenData.message || 'Failed to exchange Health ID token' },
          { status: healthIdTokenRes.status }
        );
      }

      const healthIdAccessToken = healthIdTokenData.data?.access_token;
      if (!healthIdAccessToken) {
        return NextResponse.json(
          { error: 'Health ID access token missing from response' },
          { status: 500 }
        );
      }

      // 2. Exchange Health ID token for Provider ID token
      const providerTokenUrl = `${providerIdUrl}/api/v1/services/token`;
      console.log('Requesting Provider ID access token at:', providerTokenUrl);
      const providerTokenRes = await fetch(providerTokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: providerClientId,
          secret_key: providerClientSecret,
          token_by: 'Health ID',
          token: healthIdAccessToken,
        }),
      });

      const providerTokenData = await providerTokenRes.json();
      if (!providerTokenRes.ok) {
        console.error('Provider ID Token Exchange Error:', providerTokenData);
        
        if (process.env.BYPASS_PROVIDER_VERIFICATION === 'true') {
          console.warn('BYPASS_PROVIDER_VERIFICATION is active. Falling back to mock physician profile.');
          providerProfileData = {
            account_id: healthIdTokenData.data?.account_id || "5449999999999",
            hash_cid: "7a5635c12063210ec4cb9ea689709541a0d474890e38813e78c566e09f8f6aa7",
            provider_id: "0111111111X21",
            special_title_th: "นายแพทย์",
            name_th: "หมอพร้อม สงบสุข (จำลองผ่านบายพาส)",
            firstname_th: "หมอพร้อม",
            lastname_th: "สงบสุข",
            organization: [
              {
                position: "แพทย์",
                license_id: "D9999", // maps to mock doctor code
                hcode: "10665",
                hname_th: "โรงพยาบาลทดสอบ"
              }
            ]
          };
        } else {
          return NextResponse.json(
            { 
              error: providerTokenData.message_th || providerTokenData.message || 'Failed to obtain Provider ID token',
              message: 'บัญชี Health ID นี้ไม่มีข้อมูล Provider ID ในระบบ UAT ของกระทรวงฯ (สามารถข้ามขั้นตอนนี้ได้โดยใส่ BYPASS_PROVIDER_VERIFICATION=true ใน .env.local)'
            },
            { status: providerTokenRes.status }
          );
        }
      } else {
        const providerAccessToken = providerTokenData.data?.access_token;
        if (!providerAccessToken) {
          return NextResponse.json(
            { error: 'Provider ID access token missing from response' },
            { status: 500 }
          );
        }

        // 3. Fetch Provider Profile
        const profileUrl = `${providerIdUrl}/api/v1/services/profile`;
        console.log('Fetching Provider Profile from:', profileUrl);
        const profileRes = await fetch(profileUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerAccessToken}`,
            'client-id': providerClientId,
            'secret-key': providerClientSecret,
          },
        });

        const profileData = await profileRes.json();
        if (!profileRes.ok) {
          console.error('Provider Profile Fetch Error:', profileData);
          return NextResponse.json(
            { error: profileData.message_th || profileData.message || 'Failed to fetch provider profile' },
            { status: profileRes.status }
          );
        }

        providerProfileData = profileData.data;
      }
    }

    if (!providerProfileData) {
      return NextResponse.json(
        { error: 'Failed to retrieve provider profile data' },
        { status: 500 }
      );
    }

    // Extract identifier: we will lookup using license_id or provider_id
    const providerId = providerProfileData.provider_id;
    const licenseId = providerProfileData.organization?.[0]?.license_id;
    const nameTh = providerProfileData.name_th;

    console.log(`Lookup provider in DB: ID=${providerId}, License=${licenseId}, Name=${nameTh}`);

    const conditions = [];
    const params = [];

    if (licenseId && licenseId.trim() !== '') {
      conditions.push('doctorcode = ?');
      params.push(licenseId.trim());
    }
    if (providerId && providerId.trim() !== '') {
      conditions.push('doctorcode = ?');
      params.push(providerId.trim());
    }
    if (nameTh && nameTh.trim() !== '') {
      conditions.push('name = ?');
      params.push(nameTh.trim());
    }

    let dbUser = null;

    if (conditions.length > 0) {
      const whereClause = `(${conditions.join(' OR ')}) AND account_disable <> 'Y'`;
      const dbSql = `
        SELECT loginname, name, doctorcode, groupname, department
        FROM opduser
        WHERE ${whereClause}
        UNION
        SELECT loginname, name, doctorcode, groupname, department
        FROM opduser_web 
        WHERE ${whereClause}
        LIMIT 1
      `;
      
      const unionParams = [...params, ...params];

      try {
        const dbResults = await query(dbSql, unionParams);
        if (dbResults && dbResults.length > 0) {
          dbUser = dbResults[0];
        }
      } catch (dbErr) {
        console.error('Database lookup failed, falling back to profile details:', dbErr);
      }
    }

    // If user is not found in database, we automatically create a session using the values from ProviderID
    if (!dbUser) {
      console.log('User not found in local HOSxP database. Creating session from Provider ID profile details...');
      dbUser = {
        loginname: providerId || licenseId || 'moph_provider',
        name: nameTh || `${providerProfileData.firstname_th || ''} ${providerProfileData.lastname_th || ''}`.trim() || 'แพทย์กระทรวงสาธารณสุข',
        doctorcode: licenseId || providerId || '',
        groupname: 'PHYSICIAN',
        department: 'OPD GENERAL'
      };
    }

    return NextResponse.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จผ่าน Provider ID',
      user: {
        username: dbUser.loginname,
        name: dbUser.name,
        doctorCode: dbUser.doctorcode,
        group: dbUser.groupname,
        department: dbUser.department || 'OPD GENERAL',
        providerId: providerId,
        licenseId: licenseId,
        loginMethod: 'ProviderID'
      },
      token: 'provider-id-session-token'
    });

  } catch (error) {
    console.error('Provider ID Login API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
