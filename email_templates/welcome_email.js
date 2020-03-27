function welcome_email(account){
    template =  `
    <div style="width: 75%; margin: auto; text-align: center;">
        <h1 style="color: green;">Congratulations your account is created</h1>
        <p>Dear ${account.lastname}, ${account.firstname} ${account.middlename} <p>
        <br>
        <p>Thank you for creating account with us. below are your account's info </p>
        <br>
        <table style="display: block; margin: auto; border-collapse: collapse;">
            <thead>
                <th>Account Number</th>
                <th>Account Name</th>
                <th>Email</th>
                <th>Phone Number</th>
            </thead>
            <tbody style="font-weight: bold;">
                <td style="padding:5px; border:1px solid #000;">${account.account_number}</td>
                <td style="padding:5px; border:1px solid #000;">${account.lastname}, ${account.firstname} ${account.middlename}</td>
                <td style="padding:5px; border:1px solid #000;">${account.email}</td>
                <td style="padding:5px; border:1px solid #000;">${account.phone_number}</td>
            </tbody>
        </table>
    `;

    return template;
}

module.exports = welcome_email