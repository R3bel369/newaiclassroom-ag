export default async function handler(req: any, res: any) {
  try {
    const serverModule = await import('../server.js');
    return serverModule.default(req, res);
  } catch (err: any) {
    console.error("Vercel Boot Error:", err);
    return res.status(500).json({ 
      error: "Vercel Boot Error", 
      message: err.message, 
      stack: err.stack 
    });
  }
}
