export default function reportBeacon<T>(url: string, payload: T) {
  // const blob = new Blob([JSON.stringify(payload)], {
  //   type: 'application/json',
  // })

  // navigator.sendBeacon?.(url, blob)
  console.log('payload---', payload)
}
