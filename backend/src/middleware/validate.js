import { ApiError } from '../utils/ApiError.js';

export const validate =
  (schema, source = 'body') =>
  (req, res, next) => {
    const result = schema.safeParse(source === 'query' ? req.query : req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => (issue.path.length ? `${issue.path.join('.')}: ${issue.message}` : issue.message))
        .join(', ');
      return next(new ApiError(400, message));
    }

    if (source === 'query') {
      req.validatedQuery = result.data;
    } else {
      req.body = result.data;
    }
    next();
  };
