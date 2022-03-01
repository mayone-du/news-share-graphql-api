import axios from "axios";
import cheerio from "cheerio";

export const fetchMetaFields = async (url: string) => {
  const res = await axios.get(url);
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
};
