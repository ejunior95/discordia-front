import { CurrentUser } from "@/contexts/AuthContext"

export function formatFallbackAvatarStr(user: CurrentUser) {
    if(user) {
        const names = user?.name.split(' ')
        if(names?.length === 1) {
            return `${names[0].slice(0,1)}${names[0].slice(1,1)}`
        }
        return `${names[0].slice(0,1)}${names[names.length - 1].slice(0,1)}`
    }
    return '?'
}

export function verifyDayOrNight() {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 12) {
      return 'Bom dia'
    } else if (hour >= 12 && hour < 18) {
      return 'Boa tarde'
    } else {
      return 'Boa noite'
    }
}