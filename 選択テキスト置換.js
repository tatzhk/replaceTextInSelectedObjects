
// 検索文字列と置換文字列の格納用変数
var targetTextReg = new RegExp();
var replaceText = "";

/**********************************************************
            UI作成
*********************************************************/

{// 入力ダイアログ作成

    var dialog = new Window('dialog', '選択テキスト置換', { x: 0, y: 0, width: 260, height: 140 });
    dialog.margins = 20;



    var grpABname = dialog.add("group", { x: 30, y: 20, width: 350, height: 60 });

    grpABname.add("statictext", { x: 0, y: 0, width: 40, height: 24 }, "検索");
    var targetTextBox = grpABname.add("edittext", { x: 40, y: 0, width: 150, height: 24 }, '');

    grpABname.add("statictext", { x: 0, y: 30, width: 40, height: 24 }, "置換");
    var replaceTextBox = grpABname.add("edittext", { x: 40, y: 30, width: 150, height: 24 }, "");

    targetTextBox.active = true;

    var btnOK = dialog.add("button", { x: 30, y: 90, width: 85, height: 26 }, "実行");//OK
    var btnCancel = dialog.add("button", { x: 135, y: 90, width: 85, height: 26 }, "cancel", { name: 'cancel' });//CANCEL


    //キャンセルの処理
    btnCancel.onClick = function () { dialog.close(); }

    //OKの処理
    btnOK.onClick = function () {
        dialog.close(); //ダイアログを閉じる

        // テキストボックス入力文字列を変数に格納
        targetTextReg.compile(targetTextBox.text, "g"),
        replaceText = replaceTextBox.text;

        replaceSelectedtext();

    }
}

/**********************************************************
            メインコード
*********************************************************/



dialog.center();//ダイアログ表示位置をモニターの中心に移動
dialog.show();


function replaceSelectedtext() {

    // 選択オブジェクトを取得
    var sel = app.activeDocument.selection;
    var selTexts = [];
    var groups = [];

    // 選択オブジェクトを走査して、テキストフレームを配列に格納
    // グループがあれば、groupsに格納
    for (var i = 0; i < sel.length; i++) {
        if (sel[i].typename == "TextFrame") {
            selTexts.push(sel[i]);
        } else if (sel[i].typename == "GroupItem") {
            groups.push(sel[i]);
        }
    }

    // 未処理のグループがある限りwhileループを続ける
    while (groups.length > 0) {
        var groupSel = groups[0].pageItems;

        // 前段と同様の処理 テキストフレームとグループをそれぞれ格納
        for (var k = 0; k < groupSel.length; k++) {
            if (groupSel[k].typename == "TextFrame") {
                selTexts.push(groupSel[k]);
            } else if (groupSel[k].typename == "GroupItem") {
                groups.push(groupSel[k]);
            }
        }
        //group[0]を削除し、group[1]を[0]に繰り上げることで、次ルーブで次のグループを処理
        groups.shift();
    }


    // 集めたテキストフレームの配列に対し、検索文字列を置換文字列に置換
    for (i = 0; i < selTexts.length; i++) {
        var tempText = selTexts[i].contents.replace(targetTextReg, replaceText);
        selTexts[i].contents = tempText;
    }


}