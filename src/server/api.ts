export type EchoProps = {
    message: string
}

export function echoHandler({ message }: EchoProps) {
    return { echo: message }
}

export const EchoURL = '/echo'
