export interface SocialEntry {
  type: 'github' | 'twitter' | 'email'
  icon: string
  link: string
}

export interface Creator {
  avatar: string
  name: string
  username?: string
  title?: string
  org?: string
  desc?: string
  links?: SocialEntry[]
  nameAliases?: string[]
  emailAliases?: string[]
}

const getAvatarUrl = (name: string) => `https://github.com/${name}.png`

export const creators: Creator[] = [
  {
    name: '墨璃殊',
    avatar: '',
    username: 'lishu620',
    title: '文档维护者',
    desc: '文档维护，专注于网络技术和前端开发',
    links: [
      { type: 'github', icon: 'github', link: 'https://github.com/lishu620/' },
    ],
    nameAliases: ['mlishu', '璃殊', 'm1ishu'],
    emailAliases: ['0712@mlishu.site'],
  },
].map<Creator>((c) => {
  c.avatar = c.avatar || getAvatarUrl(c.username)
  return c as Creator
})

export const creatorNames = creators.map(c => c.name)
export const creatorUsernames = creators.map(c => c.username || '')
