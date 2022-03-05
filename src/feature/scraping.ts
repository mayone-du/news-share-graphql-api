import { News } from "@prisma/client";
import axios from "axios";
import cheerio from "cheerio";

export const fetchMetaFields = async (
  url: string,
): Promise<Pick<News, "title" | "description" | "imageUrl" | "faviconUrl">> => {
  try {
    const res = await axios.get(url);
    if (res.status === 404) {
      return {
        title: "404 Not Found",
        description: "指定されたページが見つかりませんでした。再度URLを確認してください。",
        imageUrl: "",
        faviconUrl: "",
      };
    }
    const $ = cheerio.load(res.data);
    const ogTitle = $("meta[property='og:title']").attr("content");
    const ogDescription = $("meta[property='og:description']").attr("content");
    const ogImage = $("meta[property='og:image']").attr("content") || "";
    const faviconUrl = $("link[rel*='icon']").attr("href") || "";
    const title = $("title").text();
    const description = $("meta[name='description']").attr("content");
    return {
      title: ogTitle || title || "",
      description: ogDescription || description || "",
      imageUrl: ogImage,
      faviconUrl,
    };
  } catch (e) {
    console.error(e);
    return {
      title: "Application Error",
      description: "ニュース情報の取得中にエラーが発生しました。URLが不正な可能性があります。",
      imageUrl: "",
      faviconUrl: "",
    };
  }
};
