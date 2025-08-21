import { use, createContext, type PropsWithChildren, useState } from 'react'

const Context = createContext<any>({})

export function useSession() {
	const value = use(Context)
	if (!value) {
		throw new Error('useSession must be wrapped in a <SessionProvider />')
	}

	return value
}

export function SessionProvider({ children }: PropsWithChildren) {
	const [radson, setRadson] = useState<any>()
	return (
		<Context
			value={{
				radson,
				setRadson: setRadson,
			}}
		>
			{children}
		</Context>
	)
}
