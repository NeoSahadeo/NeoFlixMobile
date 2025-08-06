import { Text, TextProps } from "react-native"

export default ({ title, className, ...props }: any) => {
	return (
		<Text
			className={"text-white text-2xl font-bold mb-5 mt-4" + className}
			{...props}
		>
			{title}
		</Text>
	)
}
