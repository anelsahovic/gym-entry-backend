import express, { NextFunction, Request, Response } from 'express';
import createHttpError, { isHttpError } from 'http-errors';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import membersRoutes from './routes/members.routes';
import membershipsRoutes from './routes/memberships.routes';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { requireAuth } from './middlewares/auth';

const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();

app.use(
  cors({
    origin: 'https://anelsahovic-gym-entry.vercel.app',
    credentials: true,
  })
);
app.use(express.json());

// Initialize store with session
const PgSessionStore = connectPgSimple(session);

app.use(
  session({
    store: new PgSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      },
      createTableIfMissing: true,
    }),
    secret: SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 6000 * 60 * 8 /* 6000 * 60 = 1h => 6000 * 60 * 8 = 8h */,
      sameSite: 'none',
      secure: true,
      path: '/',
    },
    rolling: true,
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', requireAuth, usersRoutes);
app.use('/api/members', requireAuth, membersRoutes);
app.use('/api/memberships', requireAuth, membershipsRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, 'Endpoint Not Found!'));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = 'An unknown error occurred';
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
