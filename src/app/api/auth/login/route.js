import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Hash input password with MD5 for legacy compatibility with HOSxP database
    const md5Password = crypto.createHash('md5').update(password).digest('hex');

    // Secure parameterized query to authenticate user against opduser or opduser_web
    // Excludes disabled accounts and lists of compromised default passwords
    const sql = `
      SELECT loginname, name, doctorcode, groupname, department
      FROM opduser
      WHERE (loginname = ? OR doctorcode = ?) AND passweb = ? 
        AND account_disable <> 'Y'
        AND passweb NOT IN (
          'c4ca4238a0b923820dcc509a6f75849b','c20ad4d76fe97759aa27a0c99bff6710','202cb962ac59075b964b07152d234b70',
          '81dc9bdb52d04dc20036dbd8313ed055','827ccb0eea8a706c4c34a16891f84e7b','e10adc3949ba59abbe56e057f20f883e',
          'fcea920f7412b5da7be0cf42b8c93759','25d55ad283aa400af464c76d713c07ad','25f9e794323b453885f5181f1b624d0b',
          'e807f1fcf82d132f9bb018ca6738a19f'
        )
      UNION
      SELECT loginname, name, doctorcode, groupname, department
      FROM opduser_web 
      WHERE (loginname = ? OR doctorcode = ?) AND passweb = ? 
        AND account_disable <> 'Y'
      LIMIT 1
    `;

    const results = await query(sql, [username, username, md5Password, username, username, md5Password]);

    if (results.length === 0) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const user = results[0];

    // Recommendation: In a production app, issue an HttpOnly session cookie containing a secure JWT.
    // We return user session details for frontend storage/state.
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        username: user.loginname,
        name: user.name,
        doctorCode: user.doctorcode,
        group: user.groupname,
        department: user.department,
      },
      token: 'jwt-session-token-placeholder',
    });
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
