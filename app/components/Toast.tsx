import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import EasyToast from 'react-native-easy-toast';

import EventEmitter from '../utils/emitter';

const styles = StyleSheet.create({
	toast: {
		maxWidth: 300,
		padding: 10
	},
	text: {
		fontSize: 14,
		textAlign: 'center',
		fontFamily: 'Inter-Regular',
		letterSpacing: 0.01,
		includeFontPadding: false,
    color: '#fff'
	}
});

export const LISTENER = 'Toast';

let listener: Function;
let toast: EasyToast | null | undefined;

const Toast = (): React.ReactElement => {
	useEffect(() => {
		listener = EventEmitter.addEventListener(LISTENER, showToast);
		return () => {
			EventEmitter.removeListener(LISTENER, listener);
		};
	}, []);

	const getToastRef = (newToast: EasyToast | null) => (toast = newToast);

	const showToast = ({ message }: { message: string }) => {
		if (toast && toast.show) {
			toast.show(message, 1000);
		}
	};

	return (
		<EasyToast
			ref={getToastRef}
			position='center'
			style={styles.toast}
			textStyle={styles.text}
			opacity={0.9}
		/>
	);
};

export default Toast;
