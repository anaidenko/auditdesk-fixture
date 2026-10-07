export function StoreBanner({ slug, name }: { slug: string; name: string }) {
    return <img className="banner" src={`/banners/${slug}.jpg`} alt={name} />;
}
