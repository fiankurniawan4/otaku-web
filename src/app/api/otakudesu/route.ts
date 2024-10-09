// src/app/api/otakudesu/route.ts
import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

const getOtakudesu = async () => {
  const URL = 'https://otakudesu.cloud/';
  const { data: html } = await axios.get(URL);
  const $ = cheerio.load(html);
  const data: { jdlflm: string; img: string, link: string }[] = [];

  $('.rseries').each((_, element) => {
    const rapi = $(element).find('.rapi');
    const konten = $(rapi).find('.venz');
    const listItems = $(konten).find('li');

    listItems.each((_, listItem) => {
      const jdlflm = $(listItem).find('.jdlflm').text();
      const img = $(listItem).find('img').attr('src') || '';
      const link = $(listItem).find('a').attr('href') || '';
      data.push({ jdlflm, img, link });
    });
  });

  return data;
};

const getOtakudesuSearch = async (searchQuery: string) => {
  const searchURL = `https://otakudesu.cloud/?s=${encodeURIComponent(searchQuery)}&post_type=anime`;
  const { data: html } = await axios.get(searchURL);
  const $ = cheerio.load(html);
  const data: { jdlflm: string; img: string; link: string; genre: string }[] = [];

  $('.page').each((_, pageElement) => {
    const listItems = $(pageElement).find('.chivsrc li');

    listItems.each((_, listItem) => {
      const jdlSearch = $(listItem).find('h2');
      const jdlflm = jdlSearch.text();
      const img = $(listItem).find('img').attr('src') || '';
      const link = jdlSearch.find('a').attr('href') || '';
      const genre = $(listItem)
        .find('.set a')
        .map((_, tag) => $(tag).text())
        .get()
        .join(', ');

      data.push({ jdlflm, img, link, genre });
    });
  });

  return data;
};


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('q') || '';

  try {
    const data = searchQuery ? await getOtakudesuSearch(searchQuery) : await getOtakudesu();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Failed to fetch data' }, { status: 500 });
  }
}
