type AdminPlaceholderPageProps = {
  title: string;
  description: string;
};

function AdminPlaceholderPage({
  title,
  description,
}: AdminPlaceholderPageProps) {
  return (
    <section className="dashboard-hero dashboard-hero--wide">
      <p className="dashboard-eyebrow">Admin Dashboard</p>
      <h1 className="dashboard-title">{title}</h1>
      <p className="dashboard-copy">{description}</p>
    </section>
  );
}

export default AdminPlaceholderPage;
