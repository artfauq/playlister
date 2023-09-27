import { ParsedUrlQuery } from 'querystring';

import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { dehydrate, DehydratedState, QueryClient } from '@tanstack/react-query';
import { merge } from 'lodash';
import { getServerSession, Session } from 'next-auth';

import { nextAuthConfig } from '@src/config';

export type WrappedGetServerSidePropsContext<Params extends ParsedUrlQuery = ParsedUrlQuery> =
  GetServerSidePropsContext<Params> & {
    queryClient: QueryClient;
    session: Session | null;
  };

export const SSRWrapper =
  <
    Props extends Record<string, any> = Record<string, any>,
    Params extends ParsedUrlQuery = ParsedUrlQuery,
  >(
    getServerSideProps: (
      ctx: WrappedGetServerSidePropsContext<Params>,
    ) => Promise<GetServerSidePropsResult<Props>>,
  ) =>
  async (context: GetServerSidePropsContext<Params>) => {
    const queryClient = new QueryClient();

    const result = await getServerSideProps({ ...context, queryClient, session: null });

    if (!('props' in result) || 'redirect' in result || 'notFound' in result) {
      return result;
    }

    const props: GetServerSidePropsResult<{ dehydratedState: DehydratedState }> = {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };

    const pageProps = merge(result, props);

    return pageProps;
  };

export function SSRWrapperWithSession<
  Props extends Record<string, any> = Record<string, any>,
  Params extends ParsedUrlQuery = ParsedUrlQuery,
>(
  getServerSideProps:
    | ((
        ctx: WrappedGetServerSidePropsContext<Params> & {
          session: Session;
        },
      ) => Promise<GetServerSidePropsResult<Props>>)
    | undefined,
  withRedirect?: true,
): ReturnType<typeof SSRWrapper<Props, Params>>;

export function SSRWrapperWithSession<
  Props extends Record<string, any> = Record<string, any>,
  Params extends ParsedUrlQuery = ParsedUrlQuery,
>(
  getServerSideProps:
    | ((ctx: WrappedGetServerSidePropsContext<Params>) => Promise<GetServerSidePropsResult<Props>>)
    | undefined,
  withRedirect: false,
): ReturnType<typeof SSRWrapper<Props, Params>>;

export function SSRWrapperWithSession<
  Props extends Record<string, any> = Record<string, any>,
  Params extends ParsedUrlQuery = ParsedUrlQuery,
>(
  getServerSideProps: ((ctx: any) => Promise<GetServerSidePropsResult<Props>>) | undefined,
  withRedirect = true,
): ReturnType<typeof SSRWrapper<Props, Params>> {
  return SSRWrapper<Props, Params>(async context => {
    const session = await getServerSession(context.req, context.res, nextAuthConfig);

    if (!session && withRedirect) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    const result = await getServerSideProps?.({ ...context, session });

    const props: GetServerSidePropsResult<{ session: Session | null }> = {
      props: {
        session,
      },
    };

    return merge(result, props);
  });
}
