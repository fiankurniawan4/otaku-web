import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

const getOtakudesuAnime = async (link: string) => {
    const URL = link;
    const { data: html } = await axios.get(URL);
    const $ = cheerio.load(html);
    
    const data: { jdlflm: string; linkvid: string }[] = [];

    $('.episodelist').each((_, element) => {
        const listItems = $(element).find('ul li');
        
        listItems.each((_, listItem) => {
            const jdlflm = $(listItem).find('a').text();
            const linkvid = $(listItem).find('a').attr('href') || '';
            data.push({ jdlflm, linkvid });
        });
    });

    return data;
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const link = searchParams.get('link');

    if (!link) {
        return NextResponse.json({ message: 'Link is required' }, { status: 400 });
    }

    try {
        const data = await getOtakudesuAnime(link);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ message: 'Failed to fetch data' }, { status: 500 });
    }
}
