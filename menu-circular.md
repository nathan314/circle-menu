stop();

preloader.gotoAndStop(2); 
	import fl.transitions.*;
    import fl.transitions.easing.*;
    import flash.display.*;
    import flash.events.*;
    import flash.filters.*;
	import fl.transitions.Tween;
	import fl.transitions.easing.*;
	import com.greensock.*;
	import com.greensock.easing.*;
	import com.greensock.plugins.*;
import flash.events.Event;
import flash.display.Loader;
import flash.net.URLRequest;
import flash.display.BlendMode;
import flash.net.URLLoader;

TweenPlugin.activate([TintPlugin]);

var dispEsf:EfeitoEsfera;
var ativaHiper:Boolean = false;
var ativaAnima:Boolean = false;
var ativaVisu:Boolean = false;
var ativaIlustra:Boolean = false;
var desativaMenu:Boolean = false;
var buttonsArr:Array = new Array(mc.btHiper, mc.btIlustra, mc.btAnima, mc.btVisu, mc.btSobre, mc.btCur, mc.bt6, mc.bt8);
var nomeBots:MovieClip = new mc_nomeBots();
var contato:MovieClip = new mc_contato();
var logo:MovieClip = new mc_assinatura;
var relampago:MovieClip = new mc_relampago;
var	myXml:XML;
var	itensXml:XMLList;
var acesso:URLLoader = new URLLoader();
/*XML.ignoreWhitespace = true;*/ 

nomeBots:buttonMode = false;
efeito:buttonMode = false;
logo:buttonMode = false;

//
var displCorpo:EfeitoFluidoID;
circFundo2.alpha = 0;
iniciaDisp();
function iniciaDisp():void
{
	displCorpo = new EfeitoFluidoID(circFundo2);
}

//
var Q1:Number = 0;
var Q2:Number = 0;
var Q5:Number = 0;
var QQ2:Number = 0;
var Q3:Number = 0;
var Q4:Number = 0;
var QQ1:Number = 0;
var drag:int = 10;
var targetRotation:Number;
var R:Number = 0;
var i:Number = 0;
var distY:Number = 90;
var distX:Number = 0;
var radians:Number;
fundo:buttonMode = false;
circFundo2:buttonMode = false;
ativaDescri:buttonMode = true;
TweenMax.to(circFundo2, 1, {alpha:0.7});
//
            drag = 5;
            R = 0;
            Q1 = 0;
            QQ1 = 0;
            Q2 = 0;
            QQ2 = 0;
            Q3 = 0;
            Q4 = 0;
            Q5 = 0;
            distX = 0;
            distY = 90;
            i = 0;
//

function __onMouseMove(param1:MouseEvent) : void
        {
			distX = mc.x - mouseX;
            distY = mc.y - mouseY;
            return;
        }
function __onMouseOver(param1:MouseEvent) : void
        {
			ativa1 = true;
            return;
        }
function __onMouseOut(param1:MouseEvent) : void
        {
			ativa1 = false;
            return;
        }
function __onEnterFrame(param1:Event) : void
        {
		if (ativa1==true){
mc.addEventListener(MouseEvent.MOUSE_MOVE, __onMouseMove);
			}
		else{
removeEventListener(MouseEvent.MOUSE_MOVE, __onMouseMove);
		}
		if (ativa2==true){
area1.addEventListener(MouseEvent.MOUSE_MOVE, __onMouseMove);
			}
		else{
removeEventListener(MouseEvent.MOUSE_MOVE, __onMouseMove);
		}
            radians = Math.atan2(distX, distY);
            targetRotation = radians / Math.PI * 180;
            if (targetRotation < 0)
            {
                Q1 = Q1 + (targetRotation - QQ1);
            }// end if
            QQ1 = targetRotation;
            if (targetRotation > 0)
            {
                Q2 = Q2 + (targetRotation - QQ2);
            }// end if
            QQ2 = targetRotation;
            if (Q3 - 180 > targetRotation)
            {
                Q1 = Q1 + 360;
            }// end if
            Q3 = targetRotation;
            if (Q4 + 180 < targetRotation)
            {
                Q2 = Q2 - 360;
            }// end if
            Q4 = targetRotation;
            Q5 = Q1 + Q2;
            R = R + (Q5 - R) / drag;
            if (i == 1)
            {
				area1.areaAriva.gotoAndStop(1);
				area1.gotoAndStop(1);
                i = 0;
            }// end if
            if (i == 0)
            {
mc.rotation = R;
area1.gotoAndStop(1);
            }// end if
            return;
        }// end function

//-----------------------------------------------------------------------------------------
addEventListener(Event.ENTER_FRAME, __onEnterFrame);
addEventListener(MouseEvent.MOUSE_OUT, __onMouseOut);
addEventListener(MouseEvent.MOUSE_OVER, __onMouseOver);
//-----------------------------------------------------------------------------------------

inicia();
function inicia()
{
nomeBots.blendMode = BlendMode.SCREEN;
logo.blendMode = BlendMode.SCREEN;
contato.blendMode = BlendMode.DIFFERENCE;
relampago.blendMode = BlendMode.ADD;
relampago.alpha = 0;
relampago.x = relampago.y = 145;
nomeBots.y = 145;
contato.alpha = 0;
logo.alpha = 0;

addChild(logo);
logo.x = 145;
logo.y = 140;
TweenMax.to(logo, 0.5, {alpha:0.9});
centro.addEventListener(MouseEvent.ROLL_OVER, hoverLogoCt);
centro.addEventListener(MouseEvent.ROLL_OUT, outLogoCt);
centro.addEventListener(MouseEvent.MOUSE_UP, clickLogoCt);
for (var i:uint = 0; i < buttonsArr.length; i++) {
buttonsArr[i].addEventListener(MouseEvent.MOUSE_UP, clickHandler);
buttonsArr[i].addEventListener(MouseEvent.ROLL_OVER, selectBots);
buttonsArr[i].addEventListener(MouseEvent.ROLL_OUT, outBots);
}
acesso.addEventListener(Event.COMPLETE, listar);
acesso.load(new URLRequest("pnurls.xml"));
}

function listar(event:Event)
	{
	myXml = new XML(event.target.data);
	itensXml = new XMLList(myXml.elements());
	}
//------------------------------------------------------

function outBots(e:MouseEvent):void
{	
		TweenMax.fromTo(nomeBots, 0.2, {x:145, scaleX:1, scaleY:1, alpha:1}, {x:35, scaleX:0, scaleY:0.9, alpha:0, onComplete: tiraTexto});
	e.currentTarget.gotoAndPlay(12);
}
		
function outLogoCt(e:MouseEvent):void
{
		TweenMax.fromTo(nomeBots, 0.3, {x:145, scaleX:1, scaleY:1, alpha:1}, {x:35, scaleX:0, scaleY:0.9, alpha:0, onComplete: tiraTexto});

}

function tiraTexto():void
		{
			if (stage && stage.contains(nomeBots))
				{
				trace("removeu");
				removeChild(nomeBots);
				}
			TweenMax.fromTo(logo, 0.2, {y:78.45}, {y:140, scaleX:1, scaleY:1, alpha:0.9});
		}

//------------------------------------------------------
function selectBots(e:MouseEvent):void
{
	e.currentTarget.gotoAndPlay(2);
	TweenMax.fromTo(logo, 0.2, {alpha:0.9}, {y:78.45, scaleX:0.5, scaleY:0.5, alpha:0.5});
	
	iniciaDispEsf();
	addChildAt(nomeBots, 2);
	TweenMax.fromTo(nomeBots, 0.2, {x:255, scaleX:0, scaleY:0.9, alpha:0}, {x:145, scaleX:1, scaleY:1, alpha:1});

	switch (e.currentTarget) 
		{
		case mc.btHiper:
		nomeBots.nomeItens.text = "WebDesign";
		TweenMax.to(nomeBots, 0.3, {tint:0x99CC99});//99CC99
		break;
		case mc.btIlustra:
		nomeBots.nomeItens.text = "Ilustração";
		TweenMax.to(nomeBots, 0.3, {tint:0x99CC99});//99CC99
		break;
		case mc.btAnima:
		nomeBots.nomeItens.text = "Animação";
		TweenMax.to(nomeBots, 0.3, {tint:0x99CC99});//99CC99
		break;
		case mc.btVisu:
		nomeBots.nomeItens.text = "Identidade Visual";
		TweenMax.to(nomeBots, 0.3, {tint:0x99CC99});//99CC99
		break;
		case mc.btSobre:
		nomeBots.nomeItens.text = "about me";
		TweenMax.to(nomeBots, 0.3, {tint:0x99CC99});//99CC99
		break;
		case mc.btCur:
		nomeBots.nomeItens.text = "hire me";
		TweenMax.to(nomeBots, 0.3, {tint:0x99CC99});//99CC99
		break;
		case mc.bt6:
		nomeBots.nomeItens.text = "#";
		TweenMax.to(nomeBots, 0.3, {tint:0x4B6A87});//6B6B6B
		break;
		case mc.bt8:
		nomeBots.nomeItens.text = "#";
		TweenMax.to(nomeBots, 0.3, {tint:0x4B6A87});//6B6B6B
		break;
		}
}

function hoverLogoCt(e:MouseEvent):void
{
	nomeBots.nomeItens.text = "Home";
	TweenMax.fromTo(logo, 0.3, {alpha:0.9}, {y:78.45, scaleX:0.5, scaleY:0.5, alpha:0.5});
	addChildAt(nomeBots, 2);
	TweenMax.to(nomeBots, 0.3, {tint:0x99CC99});//99CC99
	TweenMax.fromTo(nomeBots, 0.4, {delay: 0.25, x:255, scaleX:0, scaleY:0.9, alpha:0}, {x:145, scaleX:1, scaleY:1, alpha:1});
}

//---------------------------------------------------------

function clickHandler(e:MouseEvent)
{
	addChildAt(relampago, 2);
	TweenMax.fromTo(relampago, 0.2, {alpha:1}, {alpha:0, onComplete: tiraRelampago});
	
	switch (e.currentTarget) 
		{
		case mc.btHiper:
		navigateToURL(new URLRequest(itensXml[0]), "_self");
		break;
		case mc.btIlustra:
		navigateToURL(new URLRequest(itensXml[1]), "_self");
		/*trace(itensXml[1].*);*/
		break;
		case mc.btAnima:
		navigateToURL(new URLRequest(itensXml[2]), "_self");
		break;
		case mc.btVisu:
		navigateToURL(new URLRequest(itensXml[3]), "_self");
		break;
		case mc.btSobre:
		navigateToURL(new URLRequest(itensXml[4]), "_self");
		break;
		case mc.btCur:
		navigateToURL(new URLRequest(itensXml[5]), "_self");
		break;
		/*case mc.bt6:
		break;
		case mc.bt8:
		break;*/
		}
}

function clickLogoCt(e:MouseEvent):void
{
	addChildAt(relampago, 2);
	TweenMax.fromTo(relampago, 0.2, {alpha:1}, {alpha:0, onComplete: tiraRelampago});
	navigateToURL(new URLRequest(itensXml[6]), "_self");
}

function tiraRelampago():void
		{
		removeChild(relampago);
		trace("removeu Relampago");
		}

//---------------------------------------------------------
function iniciaDispEsf():void
{
	dispEsf = new EfeitoEsfera(nomeBots);
}