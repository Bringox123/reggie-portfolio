export const profile = {
  name: 'Reggie',
  role: 'Full-Stack Software Developer',
  email: 'bringoxin@gmail.com',
  tagline:
    'I build secure, responsive web applications with Python/Django on the backend and TypeScript + React on the front.',
  available: true,
  availability: 'Available for new opportunities',
};

export const coreStack: string[] = [
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Python',
  'Django',
  'SQLite/PostgreSQL',
  'AWS S3',
  'Git',
];

export const engineeringFocus: { title: string; description: string }[] = [
  {
    title: 'Role-based security',
    description: 'Permissioned views and access control so each user sees only what they should.',
  },
  {
    title: 'Mobile-first ergonomics',
    description: 'Interfaces designed for small screens first, then scaled up cleanly.',
  },
  {
    title: 'Real-time KPI & cart flows',
    description: 'Live dashboards and responsive cart experiences that update instantly.',
  },
];

export const highlights: string[] = [
  'Full-stack: Django APIs to React UIs',
  'Responsive UI engineering',
  'Clean, typed, maintainable code',
  'Media storage with AWS S3',
];

export const codeSnippets = {
  'backend.py': `from django.contrib.auth.decorators import (
    login_required,
)
from django.http import JsonResponse

ALLOWED_ROLES = {"manager", "admin"}

@login_required
def kpi_summary(request):
    if request.user.role not in ALLOWED_ROLES:
        return JsonResponse(
            {"detail": "Forbidden"},
            status=403,
        )
    count = Order.objects.count()
    return JsonResponse({"orders": count})`,
  'ui.tsx': `type Props = { count: number };

export function CartBadge({ count }: Props) {
  return (
    <button className="relative rounded-xl p-3">
      <ShoppingCart aria-hidden />
      {count > 0 && (
        <span
          className="absolute -right-1 -top-1
            rounded-full bg-emerald-500 px-2
            text-xs text-white"
        >
          {count}
        </span>
      )}
    </button>
  );
}`,
} as const;

export type SnippetKey = keyof typeof codeSnippets;
