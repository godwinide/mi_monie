function alert(account, transaction){
    template =  `
    <div style="width: 75%; margin: auto;">
        <p>Dear ${account.lastname}, ${account.firstname} ${account.middlename} <p>
        <br>
        <p>We wish to notify you that a ${transaction.transaction_type} transaction has occured in your account.</p>
        <p>The details of this transaction is shown below: </p>
        <br>
        <table style="display: block; margin: auto; border-collapse: collapse;">
            <thead>
                <th></th>
                <th></th>
            </thead>

            <tbody style="font-weight: bold;">
                <td style="padding:5px; border:1px solid #000;">Account Number: </td>
                <td style="padding:5px; border:1px solid #000;">******${String(account.account_number).slice(6,10)}</td>
            </tbody>

            <tbody>
                <td style="padding:5px; border:1px solid #000;">Amount: </td>
                <td style="padding:5px; border:1px solid #000;">${transaction.amount}</td>
            </tbody>

            <tbody>
                <td style="padding:5px; border:1px solid #000;">Description: </td>
                <td style="padding:5px; border:1px solid #000;">${transaction.description}</td>
            </tbody>

            <tbody>
                <td style="padding:5px; border:1px solid #000;">Teller ID: </td>
                <td style="padding:5px; border:1px solid #000;">${transaction.teller_id}</td>
            </tbody>

            <tbody>
                <td style="padding:5px; border:1px solid #000;">Value Date: </td>
                <td style="padding:5px; border:1px solid #000;">${new Date(String(transaction.date)).toLocaleDateString()}</td>
            </tbody>

            
            <tbody>
                <td style="padding:5px; border:1px solid #000;">Value Date: </td>
                <td style="padding:5px; border:1px solid #000;">${new Date(String(transaction.date)).getHours()}:${new Date(String(transaction.date)).getMinutes()}</</td>
            </tbody>
        </table>

        <br/>
        <br/>
        <p>The balances on this account as at  ${new Date(String(transaction.date)).getHours()}:${new Date(String(transaction.date)).getMinutes()}  are as follows;</p>
        <table>
            <thead>
                <th></th>
                <th></th>
            <thead>
            <tbody>
                <td style="padding:5px; border:1px solid #000;">Current Balance: </td>
                <td style="padding:5px; border:1px solid #000;">${transaction.current_balance}</td>
            </tbody>

            <tbody>
                <td style="padding:5px; border:1px solid #000;">Available Balance: </td>
                <td style="padding:5px; border:1px solid #000;">${transaction.available_balance}</td>
            </tbody>
        </table>

        <br>
        <br>
        <br>

        <p style="color: royalblue;">For more infomation contact us:</p>
        <p style="color: royalblue;">Phone: 08078561982</p>
        <p style="color: royalblue;">Email: support@enaland.com</p>
        <p style="color: royalblue;">Website: enaland.com</p>
        <br>
        <p>Thanks for choosing Enaland Bank.</p> 
        </div>
    `;

    return template;
}

module.exports = alert;