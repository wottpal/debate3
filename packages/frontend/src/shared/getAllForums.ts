import { Forum } from '@models/Forum.model'
import { PrivyClient } from '@privy-io/privy-node'
import { GetServerSideProps } from 'next'
import { env } from './environment'

export type AllForumsProps = {
  forumsData: object[]
}

export const getAllForums: GetServerSideProps = async () => {
  // Fetch all forums / deployer users
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const client = new PrivyClient(env.privy.apiKey, env.privy.apiSecret!)
  const { next_cursor_id, users } = await client.getBatch(Forum.allFields(), {
    limit: 50,
  })

  const forums = (users || [])
    .map((u) => Forum.fromPrivyInstance(u) || null)
    .filter(Boolean) as Forum[]
  const forumsData = forums.map((f) => f.toJson())

  return {
    props: {
      forumsData,
    } as AllForumsProps,
  }
}
