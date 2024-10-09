import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

const getOtakudesuWatch = async (link: string) => {
    const URL = link;
    const { data: html } = await axios.get(URL);
    const $ = cheerio.load(html);
    
    const data: { linkvid: string, animname: string }[] = [];

    const animname = $('.posttl').text();

    $('.responsive-embed-stream').each((_, element) => {
        const linkvid = $(element).find('iframe').attr('src');
        if (linkvid) {
            data.push({ linkvid, animname });
        }
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
        const data = await getOtakudesuWatch(link);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ message: 'Failed to fetch data' }, { status: 500 });
    }
}
