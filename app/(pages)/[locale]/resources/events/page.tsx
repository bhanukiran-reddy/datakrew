import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/metadata';
import { getEventsOverviewPage } from '@/lib/graphql/queries/getEventsOverviewPage';
import EventsClient from "./EventsClient";
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const { page } = await getEventsOverviewPage();

    return buildMetadata(page?.seo || { title: 'Events - Datakrew' }, locale, { path: 'resources/events' });
}

export default async function EventsPage() {
    const { page, upcomingEvents, ongoingEvents, pastEvents } = await getEventsOverviewPage();

    if (!page) return null;

    return (
        <>
            <EventsClient
                pageData={page}
                upcomingEvents={upcomingEvents}
                ongoingEvents={ongoingEvents}
                pastEvents={pastEvents}
            />
        </>
    );
}