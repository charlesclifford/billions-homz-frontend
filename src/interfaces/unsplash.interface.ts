/* eslint-disable @typescript-eslint/no-explicit-any */
interface AlternativeSlugs {
  en: string
  es: string
  ja: string
  fr: string
  it: string
  ko: string
  de: string
  pt: string
}

interface Urls {
  raw: string
  full: string
  regular: string
  small: string
  thumb: string
  small_s3: string
}

interface Links {
  self: string
  html: string
  download: string
  download_location: string
}

interface TopicSubmission {
  status: string
}

interface TopicSubmissions {
  'architecture-interior': TopicSubmission
  travel: TopicSubmission
}

interface ProfileImage {
  small: string
  medium: string
  large: string
}

interface Social {
  instagram_username: string | null
  portfolio_url: string | null
  twitter_username: string | null
  paypal_email: string | null
}

interface User {
  id: string
  updated_at: string
  username: string
  name: string
  first_name: string
  last_name: string | null
  twitter_username: string | null
  portfolio_url: string | null
  bio: string
  location: string
  links: Links
  profile_image: ProfileImage
  instagram_username: string | null
  total_collections: number
  total_likes: number
  total_photos: number
  total_promoted_photos: number
  total_illustrations: number
  total_promoted_illustrations: number
  accepted_tos: boolean
  for_hire: boolean
  social: Social
}

export interface UnsplashPhoto {
  id: string
  slug: string
  alternative_slugs: AlternativeSlugs
  created_at: string
  updated_at: string
  promoted_at: string | null
  width: number
  height: number
  color: string
  blur_hash: string
  description: string
  alt_description: string
  breadcrumbs: any[] // Replace 'any' with a more specific type if needed
  urls: Urls
  links: Links
  likes: number
  liked_by_user: boolean
  current_user_collections: any[] // Replace 'any' with a more specific type if needed
  sponsorship: null
  topic_submissions: TopicSubmissions
  asset_type: string
  user: User
}

export interface UnsplashSearchResponse {
  results: UnsplashPhoto[]
  total: number
  total_pages: number
}
