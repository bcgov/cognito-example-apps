import { getAuthorizationUrl } from '../../../../utils/cognito';

export default async function handler(req, res) {
  try {
    const authUrl = await getAuthorizationUrl();
    return res.redirect(authUrl);
  } catch (err) {
    console.error(err);
    res.status(200).json({ success: false, error: err.message || err });
  }
}
