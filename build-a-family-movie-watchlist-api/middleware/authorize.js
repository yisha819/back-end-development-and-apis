export function authorizeModification(req, res, next) {
  const { role, id } = req.user;

  // Parents can modify any watchlist
  if (role === 'parent') return next();

  // Children can only modify their own
  if (role === 'child' && String(req.params.userId) === String(id)) {
    return next();
  }

  return res.status(403).json({ error: 'Access denied' });
}