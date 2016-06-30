var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'SendGrid',
	auth: {
		user: process.env.SENDGRID_USERNAME,
		pass: process.env.SENDGRID_PASSWORD
	}
});

/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = function(req, res) {
	res.render('contact', {
		title: req.__('ContactUs'),
		url: {
			es: req.__l('url.contactus')[1],
			en: `/en/${req.__l('url.contactus')[0]}`
		},
		link: req.__('ContactUs')
	});
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = function(req, res) {
	req.assert('name', req.__('NameCannotBeBlank')).notEmpty();
	req.assert('phone', req.__('PhoneCannotBeBlank')).notEmpty();
	req.assert('contact', req.__('ContactCannotBeBlank')).notEmpty();
	req.assert('email', req.__('EmailIsNotValid')).isEmail();
	req.assert('message', req.__('MessageCannotBeBlank')).notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		if(req.getLocale() === 'es'){
			return res.redirect(req.__('url.contactus'));   
		}
		return res.redirect('/' + req.getLocale() + req.__('url.contactus'));
	}

	var from = process.env.SEND_EMAIL_FROM;
	var to = process.env.SEND_EMAIL_TO;
	var cc = process.env.SEND_EMAIL_CC;
	var subject = process.env.SEND_EMAIL_SUBJECT;

// create template based sender function
	var sendMessage = transporter.templateSender({
		html: `
			<div>
				<h2>Consulta Online</h2>
				<p>Se ha realizado una consulta con los siguientes datos:</p>
				<table>
					<tbody>
						<tr>
							<td><strong>Nombre:</strong></td>
							<td>{{name}}</td>
						</tr>
						<tr>
							<td><strong>Email:</strong></td>
							<td><a href='mailto:{{email}}' target='_blank'>{{email}}</a></td>
						</tr>
						<tr>
							<td><strong>Teléfono:</strong></td>
							<td>{{phone}}</td>
						</tr>
						<tr>
							<td><strong>Contacto:</strong></td>
							<td>{{contact}}</td>
						</tr>
						<tr>
							<td><strong>Mensaje:</strong></td>
							<td>{{message}}</td>
						</tr>
					</tbody>
				</table>
			</div>`
	});
	var mailOptions = {
		to: to,
		cc: cc,
		from: from,
		subject: subject
	};
	var context = {
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		contact: req.body.contact,
		message: req.body.message
	};
	// use template based sender to send a message
	sendMessage(mailOptions, context , function(err){
		if (err) {
			req.flash('errors', { msg: err.message });
			return res.redirect('/' + req.getLocale() + req.__('url.contactus'));
		}
		req.flash('success', { msg: req.__('EmailSentCorrectly') });
		res.redirect('/' + req.getLocale() + req.__('url.contactus'));
	});
};
