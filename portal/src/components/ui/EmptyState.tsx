interface EmptyStateProps {
  title: string;
  description?: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="text-4xl mb-4">📭</div>
      <p className="text-gray-700 font-medium">{title}</p>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  );
}
