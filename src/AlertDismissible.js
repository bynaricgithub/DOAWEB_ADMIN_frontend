import React from "react";
import Alert from "react-bootstrap/Alert";
import { useEffect } from "react";
import { Markup } from "interweave";

function AlertDismissible(props) {
	const { msgType } = props;

	useEffect(() => {
		const interval = setTimeout(() => {
			props.mySetShow(false);
		}, 3000);

		return () => clearInterval(interval);
	}, [props]);

	return props.myShow && props.myMsg ? (
		<>
			<center
				style={{
					fontFamily: 'Open Sans',
					borderRadius: '8px',
					boxShadow: " 0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 2px 15px 0 rgba(0, 0, 0, 0.05)",
					position: "fixed",
					top: "1%",
					width: "30%",
					left: "35%",
					zIndex: "99999",
					// paddingBottom: '0px',
					background: '#3B71CA'
				}}>
				<div
					className={"alert alert-info alert-dismissible fade show text-center shadow"}
					role="alert"
					style={{
						color: '#3B71CA',
						fontSize: '110%',
						borderRadius: '8px',
						borderTopLeftRadius: '2px',
						borderTopRightRadius: '2px',
						// padding: '15px 15px',
						margin: "0px",
						background: 'white'
					}}
				>
					<button
						type="button"
						className="close"
						data-dismiss="alert"
						aria-label="Close"
						onClick={() => props.mySetShow(false)}
					>
						<span aria-hidden="true">&times;</span>
					</button>
					<Markup content={props.myMsg} />
				</div>
			</center >
		</>
	) : null;
}

export default AlertDismissible;
