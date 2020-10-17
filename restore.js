const dhive = require('@hiveio/dhive');
const client = new dhive.Client('https://anyx.io', {rebrandedApi: true});

const restored_accounts = [
    // Errored accounts
    "akiroq",
    "balticbadger",
    "dailychina",
    "dailystats",
    "dftba",
    "double-u",
    "edgarare1",
    "electrodo",
    "fadetoblack",
    "freedompoint",
    "friendlystranger",
    "john371911",
    "juancar347",
    "kdtkaren",
    "lichtblick",
    "lifeskills-tv",
    "lotusfleur",
    "ricko66",
    "rynow",
    "scottcbusiness",
    "seo-boss",
    "sgbonus",
    "spoke",
    "steemchiller",
    "steemflower",
    "stimp1024",
    "travelnepal",
    "truce",
    "tuckerjtruman",
    "yanirauseche",

    // Won their aidrop appeal (proposal #104)
    "lupafilotaxia",
    "thebigsweed",
    "farm-mom",
    "soufiani",

    // Won their airdrop appeal (proposal #111)
    "aellly",
    "angelina6688",
    "cheva",
    "cnfund",
    "cn-malaysia",
    "devyleona",
    "huangzuomin",
    "jademont",
    "mrpointp",
    "mrspointm",
    "shenchensucc",
    "softmetal",
    "stepbie",
    "windowglass",
    "wongshiying",
    "xiaoshancun",
    "yellowbird",
]
const hf24_blocknum = 41818752

// Sends to everyone in the same block
async function send_instantly(){
    const dry_run = true
    const props = await client.database.getDynamicGlobalProperties();

    const privateKey = dhive.PrivateKey.fromString("your private key here");
    const username = "alpha"
    let vops = await client.database.call('get_ops_in_block', [hf24_blocknum, false])

    let ops = []
    let total_hive = 0
    for (let i = 0; i < vops.length; i++) {
        const vop = vops[i]
        if (vop.op[0] === "hardfork_hive" && restored_accounts.indexOf(vop.op[1].account) !== -1) {
            // Convert the converted vests to hive
            let hiveToTransfer = parseFloat(parseFloat(props.total_vesting_fund_hive) * parseFloat(vop.op[1].vests_converted) / parseFloat(props.total_vesting_shares)).toFixed(3);
            ops.push([
                "transfer_to_vesting",
                {
                    from: username,
                    to: vop.op[1].account,
                    amount: `${hiveToTransfer} HIVE`
                }
            ])
            total_hive += parseFloat(hiveToTransfer)
        }
    }

    if (ops.length !== restored_accounts.length) {
        console.error("Did not find some of the restored accounts in the vops")
    }

    console.log(`powering up ${total_hive} to ${ops.length} accounts`)
    console.log(ops)

    if (!dry_run) {
        client.broadcast.sendOperations(ops, privateKey).then(function (result) {
            console.log('Included in block: ' + result.block_num)
        }, function (error) {
            console.error(error);
        });
    } else {
        console.log("set dry run to false if you want to execute the operation")
    }
}

send_instantly()