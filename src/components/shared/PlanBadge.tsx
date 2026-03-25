import { Badge } from '@/components/ui/badge'
import { Plan } from '@/types'

interface PlanBadgeProps {
  plan: Plan
}

export default function PlanBadge({ plan }: PlanBadgeProps) {
  switch (plan) {
    case 'free':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Free</Badge>
    case 'pro':
      return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">Pro</Badge>
    case 'enterprise':
      return <Badge variant="default" className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">Enterprise</Badge>
    default:
      return <Badge variant="outline">{plan}</Badge>
  }
}
