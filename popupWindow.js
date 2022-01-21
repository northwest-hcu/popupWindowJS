'use strict';

class PopupWindow{
  constructor(dictList,windowTitle,...options){
    this.parent=null;
    this.children=[];
    this.draggable=true; //ドラッグを有効にするかどうか
    this.mouseX=0; //現在のマウス座標(x軸)
    this.mouseY=0; //現在のマウス座標(y軸)
    this.dragFlag=false; //ドラッグ中かどうか
    //ウインドウ基礎パーツ設定
    this.body=document.createElement('div');
    this.header=document.createElement('div');
    this.closeBtn=document.createElement('span');
    this.title=document.createElement('span');
    //デフォルト値
    this.options={width:'auto',height:'auto',left:'auto',top:'20px',color:'rgb(80,80,160)',center:false,key:null};
    //デザインオプションの値を入力されているところだけ代入
    if(options.length===1){
      options=options[0];
      for(let key in options){
        if(key in this.options){
          this.options[key]=options[key];
        }
      }
    }
    //ドラッグイベント設定
    this.header.addEventListener('touchstart',{handleEvent:this.dragStart,elem:this},false);
    this.header.addEventListener('touchmove',{handleEvent:this.dragMove,elem:this},false);
    this.header.addEventListener('touchend',{handleEvent:this.dragEnd,elem:this},false);
    this.header.addEventListener('touchcancel',{handleEvent:this.dragEnd,elem:this},false);
    this.header.addEventListener('mousedown',{handleEvent:this.dragStart,elem:this},false);
    this.header.addEventListener('mousemove',{handleEvent:this.dragMove,elem:this},false);
    this.header.addEventListener('mouseup',{handleEvent:this.dragEnd,elem:this},false);
    this.header.addEventListener('mouseout',{handleEvent:this.dragEnd,elem:this},false);
    //デザイン設定
    document.body.appendChild(this.body);
    this.body.style.position='fixed';
    this.body.style.backgroundColor='white';
    this.body.style.border='1px solid '+this.options.color;
    this.body.style.height=this.options.height;
    this.body.style.width=this.options.width;
    if(this.options.center){
      this.body.style.left=parseInt(window.innerWidth/2)-parseInt(this.body.getBoundingClientRect().width/2)+'px';
    }else{
      this.body.style.left=this.options.left;
    }
    this.body.style.top=this.options.top;
    this.body.style.overflow='hidden';
    this.body.appendChild(this.header);
    this.header.style.backgroundColor=this.options.color;
    this.header.style.display='flex';
    this.header.style.justifyContent='space-between';
    this.header.style.cursor='pointer';
    this.header.appendChild(this.title);
    this.header.appendChild(this.closeBtn);
    this.title.innerHTML=windowTitle;
    this.title.style.color='white';
    this.title.style.fontSize='20px';
    this.title.style.padding='5px 10px';
    this.closeBtn.innerHTML='✕';
    this.closeBtn.style.color='white';
    this.closeBtn.style.fontWeight='bold';
    this.closeBtn.style.padding='5px 10px';
    this.closeBtn.style.fontSize='20px';
    this.closeBtn.style.cursor='pointer';
    //ウインドウ削除イベントの設定
    this.closeBtn.addEventListener('click',{handleEvent:this.closeWindow,elem:this},false);
    let elem;//要素作成用
    let flexElem,flag=false;//横並べ用
    for(let i=0;i<dictList.length;i++){
      elem=this.createInputs(dictList[i].type,dictList[i].options); //要素取得
      if(elem!=='start' && elem!=='end' && !flag && elem){
        //flexオプション無しの場合
        this.body.appendChild(elem);
      }else if(elem==='start'){
        //flexオプションがつけられた場合
        flexElem=document.createElement('div');
        flexElem.style.display='flex';
        flexElem.style.justifyContent='center';
        this.body.appendChild(flexElem);
        flag=true;
      }else if(elem==='end'){
        //flexオプションが終わった場合
        flag=false;
      }else if(elem!=='start' && elem!=='end' && flag && elem){
        //flexオプション中
        flexElem.appendChild(elem);
      }
    }
  }

  //入力要素作成関数
  /* type別処理 */
  /* text:テキスト入力 + keydownイベント */
  /* btn:ボタン + clickイベント */
  /* date:日付入力 */
  /* textarea:複数行テキスト入力 */
  /* msg:ウインドウに表示するテキスト */
  /* img:画像表示 + clickイベント */
  /* startFlex:横並べ開始(主にbtn) */
  /* endFlex:横並べ終わり(主にbtn) */

  createInputs(type, //入力形式
    {label='Label', //ラベル名
    id='', //付与するid
    border='1px solid black', //枠線CSS
    fontSize='20px', //文字の大きさCSS
    backgroundColor='white', //背景色CSS
    hoverColor='silver', //ホバー時の背景色
    width='100px', //横幅CSS
    func=null, //実行関数
    defaultValue=(new Date()).getFullYear()+'/'+(new Date().getMonth()+1)+'/'+(new Date().getDate()), //入力初期値(デフォルトは現在の日付)
    placeholder='', //ヒント
    path='', //画像パス
    closeEvent=false} //ボタンをクリックしたときにウインドウを閉じるかどうか
  ){
    if(type==='text'){
      //DOM構築
      const elem=document.createElement('div');
      const input=document.createElement('input');
      const title=document.createElement('span');
      elem.appendChild(title);
      elem.appendChild(input);
      title.innerHTML=label;
      input.setAttribute('id',id);
      //デザイン設定
      elem.style.padding='5px';
      input.style.outline='0px';
      input.style.border=border;
      input.style.fontSize=fontSize;
      title.style.fontSize=fontSize;
      input.style.width=width;
      input.placeholder=placeholder;
      input.value=defaultValue;
      //イベント設定
      input.addEventListener('focus',this.onFocusInput,false);
      input.addEventListener('blur',this.onBlurInput,false);
      input.addEventListener('keydown',func,false);
      return elem;
    }else if(type==='btn'){
      //DOM構築
      const elem=document.createElement('div');
      elem.innerHTML=label;
      elem.setAttribute('id',id);
      //デザイン設定
      elem.style.padding='5px 10px';
      elem.style.border=border;
      elem.style.borderRadius='20px';
      elem.style.backgroundColor=backgroundColor;
      elem.style.float='left';
      elem.style.margin='20px';
      elem.style.cursor='pointer';
      elem.style.width=width;
      elem.style.textAlign='center';
      //イベント設定
      elem.addEventListener('mouseover',{handleEvent:this.hoverBtn,color:hoverColor},false);
      elem.addEventListener('mouseout',{handleEvent:this.landingBtn,color:backgroundColor},false);
      if(closeEvent){
        elem.addEventListener('click',{handleEvent:this.closeWindow,elem:this},false);
      }
      elem.addEventListener('click',func,false);
      return elem;
    }else if(type==='date'){
      //DOM構築
      const date=defaultValue.split('/');
      //デフォルト値がなければ中止
      if(date.length!=3){
        return false;
      }
      const elem=document.createElement('div');
      const year=document.createElement('input');
      const yearLabel=document.createElement('span');
      const month=document.createElement('input');
      const monthLabel=document.createElement('span');
      const day=document.createElement('input');
      const dayLabel=document.createElement('span');
      const title=document.createElement('span');
      year.setAttribute('id',id+'_year');
      month.setAttribute('id',id+'_month');
      day.setAttribute('id',id+'_day');
      elem.appendChild(title);
      elem.appendChild(year);
      elem.appendChild(yearLabel);
      elem.appendChild(month);
      elem.appendChild(monthLabel);
      elem.appendChild(day);
      elem.appendChild(dayLabel);
      title.innerHTML=label;
      //デザイン設定
      year.type='number';
      year.min='1000';
      year.max='9999';
      year.value=date[0];
      month.type='number';
      month.min='1';
      month.max='12';
      month.value=date[1];
      day.type='number';
      day.min='1';
      day.max='31';
      day.value=date[2];
      yearLabel.innerHTML='年';
      monthLabel.innerHTML='月';
      dayLabel.innerHTML='日';
      year.style.fontSize=fontSize;
      month.style.fontSize=fontSize;
      day.style.fontSize=fontSize;
      yearLabel.style.fontSize=fontSize;
      monthLabel.style.fontSize=fontSize;
      dayLabel.style.fontSize=fontSize;
      year.style.border=border;
      month.style.border=border;
      day.style.border=border;
      day.style.border=border;
      year.style.outline='0px';
      month.style.outline='0px';
      day.style.outline='0px';
      year.style.width='3em';
      month.style.width='2em';
      day.style.width='2em';
      year.style.textAlign='right';
      month.style.textAlign='right';
      day.style.textAlign='right';
      title.style.fontSize=fontSize;
      elem.style.padding='5px';
      //イベント設定
      year.addEventListener('focus',this.onFocusInput,false);
      year.addEventListener('blur',this.onBlurInput,false);
      month.addEventListener('focus',this.onFocusInput,false);
      month.addEventListener('blur',this.onBlurInput,false);
      day.addEventListener('focus',this.onFocusInput,false);
      day.addEventListener('blur',this.onBlurInput,false);
      return elem;
    }else if(type==='textarea'){
      //DOM構築
      const elem=document.createElement('div');
      const input=document.createElement('textarea');
      const title=document.createElement('p');
      elem.appendChild(title);
      elem.appendChild(input);
      title.innerHTML=label;
      input.setAttribute('id',id);
      //デザイン設定
      elem.style.padding='5px';
      input.style.outline='0px';
      input.style.border=border;
      input.style.fontSize=fontSize;
      title.style.fontSize=fontSize;
      input.placeholder=placeholder;
      input.value=defaultValue;
      input.cols='40';
      input.rows='4';
      input.style.resize='none';
      //イベント設定
      input.addEventListener('focus',this.onFocusInput,false);
      input.addEventListener('blur',this.onBlurInput,false);
      return elem;
    }else if(type==='msg'){
      //DOM構築
      const elem=document.createElement('div');
      elem.innerHTML=label;
      //デザイン設定
      elem.style.textAlign='center';
      elem.style.fontSize=fontSize;
      return elem;
    }else if(type==='img'){
      //DOM構築
      const elem=document.createElement('div');
      const img=document.createElement('img');
      elem.appendChild(img);
      img.src=path;
      img.alt=label;
      //デザイン設定
      img.style.width=width;
      img.style.cursor='pointer';
      elem.style.textAlign='center';
      //イベント設定
      img.addEventListener('click',func,false);
      if(closeEvent){
        elem.addEventListener('click',{handleEvent:this.closeWindow,elem:this},false);
      }
      return elem;
    }else if(type==='startFlex'){
      return 'start';
    }else if(type==='endFlex'){
      return 'end';
    }else{
      return false;
    }
  }

  //ホバー時背景色変更
  hoverBtn(e){
    e.currentTarget.style.backgroundColor=this.color;
  }

  //アンホバー時背景色変更
  landingBtn(e){
    e.currentTarget.style.backgroundColor=this.color;
  }

  //フォーカス時
  onFocusInput(){
    this.style.border='1px solid blue';
  }

  //アンフォーカス時
  onBlurInput(){
    this.style.border='1px solid black';
  }

  //ウインドウの削除(子要素からの場合)
  closeWindow(){
    let closeEvent; //強制発火させるためのイベント変数の枠
    //親がいる場合、親の子要素群から自身を削除する
    if(this.elem.parent){
      this.elem.parent.removeChild(this.elem);
    }
    //子要素全てでcloseBtnを押したときの処理を強制発火
    while(this.elem.children.length>0){
      closeEvent=new Event('click',{bubbles:false,cancelable:true});
      this.elem.children[0].closeBtn.dispatchEvent(closeEvent);
    }
    //ウインドウを消す
    this.elem.body.outerHTML='';

  }

  //デバッグ用
  showChildren(){
    let content='';
    for(let i=0;i<this.children.length;i++){
      content+=this.children[i].options.key+' + ';
    }
    console.log(content);
  }

  //子の追加
  //elem:子として追加するPopupWindowオブジェクト
  addChild(elem){
    for(let i=0;i<this.children.length;i++){
      if(this.children[i].options.key===elem.options.key){
        return false;
      }
    }
    this.children.push(elem);
    elem.parent=this;
  }

  //子の削除
  //elem:削除する子のPopupWindowオブジェクト
  removeChild(elem){
    for(let i=0;i<this.children.length;i++){
      if(this.children[i].options.key===elem.options.key){
        this.children.splice(i,1);
        elem.parent=null;
        return;
      }
    }
  }

  //ドラッグ開始時
  dragStart(e){
    if(this.elem.draggable && !this.elem.dragFlag){
      this.elem.mouseX=e.clientX;
      this.elem.mouseY=e.clientY;
      this.elem.dragFlag=true;
    }
  }

  //ドラッグ時
  dragMove(e){
    if(this.elem.draggable && this.elem.dragFlag){
      this.elem.body.style.left=parseInt(this.elem.body.style.left)+parseInt(e.clientX-this.elem.mouseX)+'px';
      this.elem.body.style.top=parseInt(this.elem.body.style.top)+parseInt(e.clientY-this.elem.mouseY)+'px';
      this.elem.mouseX=e.clientX;
      this.elem.mouseY=e.clientY;
    }
  }

  //ドラッグ終了時
  dragEnd(e){
    if(this.elem.draggable && this.elem.dragFlag){
      this.elem.mouseX=e.clientX;
      this.elem.mouseY=e.clientY;
      this.elem.dragFlag=false;
    }
  }

  //ドラッグイベント変更
  /*
  flag:true >> 移動可能
  flag:false >> 移動不可
  */
  setDraggable(flag){
    this.draggable=flag;
  }

  //ウインドウの非表示・表示
  /*
  flag:true >> 非表示
  flag:false >> 表示
  */
  hide(flag){
    if(flag){
      this.body.style.display='none';
    }else{
      this.body.style.display='block';
    }
  }

  //ウインドウの移動
  /*
  x:x座標軸
  y:y座標軸
  abs:true >> 絶対位置に移動
  abs:false >> 相対位置に移動
  */
  translate(x,y,abs){
    if(abs){
      this.body.style.left=x+'px';
      this.body.style.top=y+'px';
    }else{
      this.body.style.left=(this.body.getBoundingClientRect().left+x)+'px';
      this.body.style.top=(this.body.getBoundingClientRect().top+y)+'px';
    }
  }

  //ウインドウを一番上に持ってくる
  topLevel(){
    document.body.appendChild(this.body);
  }

}

//確認ウインドウ
function confirmWindow(msg,trueFunc,falseFunc){
  const popupWindow=new PopupWindow([
    {'type':'msg','options':{
      'label':msg
    }},
    {'type':'startFlex','options':{}},
    {'type':'btn','options':{
      'func':trueFunc,
      'closeEvent':true,
      'label':'OK'
    }},
    {'type':'btn','options':{
      'func':falseFunc,
      'closeEvent':true,
      'label':'キャンセル'
    }},
    {'type':'endFlex','options':{}}
  ],'',{width:'300px',center:true});
  return popupWindow;
}

//警告ウインドウ
function alertWindow(msg){
  const popupWindow=new PopupWindow([
    {'type':'msg','options':{
      'label':msg
    }},
    {'type':'startFlex','options':{}},
    {'type':'btn','options':{
      'closeEvent':true,
      'label':'OK'
    }},
    {'type':'endFlex','options':{}}
  ],'Alert!',{width:'300px',color:'rgb(200,60,60)',center:true});
  return popupWindow;
}

//ウインドウの拡散関数
function spreadWindow(parentWindow,count){
  let popupWindow;
  const widthRange=window.innerWidth;
  const heightRange=window.innerHeight;
  for(let i=0;i<count;i++){
    popupWindow=new PopupWindow([
      {'type':'msg','options':{
        'label':'ウインドウが増殖しています.'
      }},
      {'type':'startFlex','options':{}},
      {'type':'btn','options':{
        'closeEvent':true,
        'label':'OK'
      }},
      {'type':'endFlex','options':{}}
    ],'警告!',{width:'300px',top:(Math.random()*heightRange)+'px',left:(Math.random()*widthRange)+'px',color:'rgb(200,60,60)',key:'alert_'+i});
    parentWindow.addChild(popupWindow);
    popupWindow.setDraggable(true);
    popupWindow.hide(true);
  }
}
