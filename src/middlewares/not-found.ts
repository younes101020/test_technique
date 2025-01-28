import type { NotFoundHandler } from "hono";

class NotFoundMiddleware {
  private static readonly NOT_FOUND = 404;
  private static readonly NOT_FOUND_MESSAGE = "Not Found";

  public handle: NotFoundHandler = (c) => {
    return c.json({
      message: `${NotFoundMiddleware.NOT_FOUND_MESSAGE} - ${c.req.path}`,
    }, NotFoundMiddleware.NOT_FOUND);
  };
}

const middleware = new NotFoundMiddleware();
export default middleware.handle;