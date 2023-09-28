import React from "react";

const Footer = () => {
	var d = new Date();
	return (
		<div className="footer out-footer">
			<div className="copyright">
				<p>Copyright © 					
					{" "}Developed by{" "}
					<a href="http://innoura.com/" target="_blank"  rel="noreferrer">
					Innoura Technologies
					</a>{" "}
					{d.getFullYear()}
				</p>
			</div>
		</div>
	);
};

export default Footer;
