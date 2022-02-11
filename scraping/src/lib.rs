#![deny(clippy::all)]
use scraper;

#[macro_use]
extern crate napi_derive;

#[napi(object)]
pub struct MetaFields {
    pub title: String,
    pub description: String,
    pub image_url: String,
}

#[tokio::main]
#[napi]
pub async fn fetch_meta_fields(url: String) -> Result<MetaFields, napi::Error> {
    let body = reqwest::get(&url).await.unwrap().text().await.unwrap();

    let fragment = scraper::Html::parse_fragment(&body);

    let (og_title_selector, og_description_selector, og_image_selector) = get_og_selectors();
    let meta_title_selector = scraper::Selector::parse("title").unwrap();
    let meta_description_selector =
        scraper::Selector::parse(r#"meta[property="description"]"#).unwrap();

    let mut meta_fields = MetaFields {
        title: "".to_string(),
        description: "".to_string(),
        image_url: "".to_string(),
    };

    // title
    for element in fragment.select(&og_title_selector) {
        meta_fields.title = match element.value().attr("content") {
            Some(content) => content.to_string(),
            None => {
                let mut title = "".to_string();
                for title_tag in fragment.select(&meta_title_selector) {
                    title += title_tag.text().collect::<Vec<_>>().join(" ").as_str();
                }
                title
            }
        };
    }
    // description
    for element in fragment.select(&og_description_selector) {
        meta_fields.description = match element.value().attr("content") {
            Some(content) => content.to_string(),
            None => {
                let mut description = "".to_string();
                for description_tag in fragment.select(&meta_description_selector) {
                    description += description_tag
                        .value()
                        .attr("content")
                        .unwrap()
                        .to_string()
                        .as_str();
                }
                description
            }
        };
    }
    // image
    for element in fragment.select(&og_image_selector) {
        meta_fields.image_url = match element.value().attr("content") {
            Some(content) => content.to_string(),
            None => "".to_string(),
        };
    }

    Ok(meta_fields)
}

fn get_og_selectors() -> (scraper::Selector, scraper::Selector, scraper::Selector) {
    let (title, description, image) = ("title", "description", "image");
    // let selector_temp = r#"meta[property="og:{}"]"#;
    (
        scraper::Selector::parse(&format!(r#"meta[property="og:{}"]"#, title)).unwrap(),
        scraper::Selector::parse(&format!(r#"meta[property="og:{}"]"#, description)).unwrap(),
        scraper::Selector::parse(&format!(r#"meta[property="og:{}"]"#, image)).unwrap(),
    )
}
