export const DEFAULT_SITE_NAME = "LASTWOLF";
export const DEFAULT_SITE_DESCRIPTION = "LASTWOLFは短期人狼が無料で遊べるWebサービスです。";
export const DEFAULT_SITE_URL = "https://lastwolf.netlify.app";
export const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}/image/ogp/top.jpg`;

export interface SeoConfig {
  title?: string;
  description?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  keywords?: string;
  noIndex?: boolean;
}

/**
 * ページのSEOメタ情報を生成する
 */
export function buildPageMeta(config: SeoConfig = {}) {
  const {
    title = "",
    description = DEFAULT_SITE_DESCRIPTION,
    ogType = "website",
    ogImage = DEFAULT_OG_IMAGE,
    twitterCard = "summary_large_image",
    keywords = "",
    noIndex = false,
  } = config;

  // OGメタ用のフルタイトル（OGメタにはtitleTemplateが適用されないため）
  const fullTitle = title ? `${title} | ${DEFAULT_SITE_NAME}` : DEFAULT_SITE_NAME;

  const meta: Record<string, string> = {
    description,
    ogTitle: fullTitle,
    ogDescription: description,
    ogType,
    ogImage,
    ogSiteName: DEFAULT_SITE_NAME,
    twitterCard,
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: ogImage,
  };

  // titleが指定されている場合のみtitleを設定（titleTemplateが適用される）
  if (title) {
    meta.title = title;
  }

  if (keywords) {
    meta.keywords = keywords;
  }

  if (noIndex) {
    meta.robots = "noindex,nofollow";
  }

  return meta;
}

/**
 * canonical URLを生成するヘルパー関数
 * @param path - URLのパス部分（例: '/about', '/village-list'）
 * @returns 完全なcanonical URL
 */
export function createCanonicalUrl(path: string): string {
  // パスが '/' で始まっていない場合は追加
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  // 末尾のスラッシュを削除（ルート以外）
  const cleanPath = normalizedPath === "/" ? normalizedPath : normalizedPath.replace(/\/$/, "");
  return `${DEFAULT_SITE_URL}${cleanPath}`;
}

/**
 * canonical linkタグを作成するヘルパー関数
 * useHead()で使用する形式で返す
 * @param path - URLのパス部分
 */
export function createCanonicalLink(path: string) {
  return {
    link: [
      {
        rel: "canonical",
        href: createCanonicalUrl(path),
      },
    ],
  };
}
