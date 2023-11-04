<?php
// version: 1


// ザガタ。六 /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

namespace { 

	class zlo {
		public static $ar = array();
		public static function da($m,$o=false,$f=false) { # module, object, function
		global $za;
			if($o) {
				self::$ar[] = array($m,$o,$f);
			} else {
				$ix = count(self::$ar);
				for($i=0;$i<$ix;$i++) {
					if(self::$ar[$i][0]==$m) {
						call_user_func(array(self::$ar[$i][1],self::$ar[$i][2]),$m);
					} else {}
				}
			}
		}
	}

}

////////////////////////////////////////////////////////////////
namespace za\zZ { 

	class zZ {
		/* Zagata.CORE */
		public $x = array( array('ca'=>'vrs') ); // memo
		public $m = array(); // modules
		public $e = array(); // event	
		
		public $cmn = null;
		public $now = null;
		
		public $cd = '';
		public $dd = '/';
		
		/////////////////////////////// 
		// memory
		public function mm($k=false,$v=false) {
			if($k=='del'&&$v) { // del
				if(is_numeric($v)) { // by id
					$i = 0; $ix = count($this->x);
					while($i < $ix) {
						if(isset($this->x[$i]['id']) && $this->x[$i]['id']==$v) {
							array_splice($this->x, $i, 1); break;
						} else {}
						$i+=1;
					}
				} elseif(is_array($v)) { // definite field
					$re = $this->mm($v[0]);
					if(isset($re[0][$v[1]])) {
						unset($re[0][$v[1]]);
						$this->mm($v[0],$re[0]);
					} else {}
				} else {}
			} elseif($k and $v) { // red
				if(is_numeric($k)) {
					$ix = count($this->x); for($i=0;$i<$ix;$i++) {
						if(isset($this->x[$i]['id'])&&$this->x[$i]['id']==$k) {
							$this->x[$i] = $v;
							break;
						} else {}
					}
				} elseif(is_string($k)) {
					$ix = count($this->x); for($i=0;$i<$ix;$i++) {
						if(isset($this->x[$i]['ca'])&&$this->x[$i]['ca']==$k) {
							if(is_numeric($v)||is_string($v)) {
								$this->x[$i] = $v;
							} elseif(is_array($v)) {
								$this->x[$i] = array_merge($this->x[$i],$v);
							} else {}
						} else {}
					}
				} elseif(is_array($k)) { // ???
					$re = $this->mm($k[0]);
					$re[0][$k[1]] = $v;
					$this->mm($k[0],$re[0]);
				} else {
					$this->msg('err','zZ','u can not edit records by '.gettype($k));
				}
			} elseif($k) { // get
				$re = array(); $ix = count($this->x);
				for($i=0;$i<$ix;$i++) {
					if(is_numeric($k)&&(isset($this->x[$i]['id'])&&$this->x[$i]['id']==$k)) {
						$re[] = $this->x[$i]; 
						break;
					} elseif(is_string($k)&&(isset($this->x[$i]['ca'])&&$this->x[$i]['ca']==$k)) {
						$re[] = $this->x[$i]; 
					} elseif(is_array($k)&&((isset($this->x[$i]['ca'])&&$this->x[$i]['ca']==$k[0])||(isset($this->x[$i]['id'])&&$this->x[$i]['id']==$k[0]))) {
						$re = ((isset($this->x[$i][$k[1]]))?$this->x[$i][$k[1]]:false);
					} else { }
				}
				return ((is_array($re)&&count($re)>0)||!is_array($re))?$re:false;
			} elseif($v) { // add
				$this->x[] = $v;
			} else {
				$this->msg('err','zZ','no condition accepted by mm: '.$k);
			}
		return $this;	
		}
		
		public function max($k) {
			$re=0; $ix = count($this->x); for($i=0;$i<$ix;$i++) {
				if(isset($this->x[$i][$k])&&$re<$this->x[$i][$k]) {
					$re = $this->x[$i][$k];
				} else {}
			}
		return $re;
		}
		
		/////////////////////////////// 
		// event
		public function ee($k=false, $v=false) {
			if( $k=='del' && is_array($v)) { // del
				if(isset($this->e[$v[0]])&&in_array($v[1],$this->e[$v[0]])) {
					array_splice($this->e[$v[0]], array_search($v[1],$this->e[$v[0]]), 1);
				} else {}
			} elseif($k && $v) { // add
				if(!isset($this->e[$k])) { 
					$this->e[$k] = array();
				} else {}
				$this->e[$k][] = $v;
			} elseif( isset($this->e[$k]) ) { // call
				$this->now = $k;  // current event
				$ix = count($this->e[$k]); for($i=0;$i<$ix;$i++) {
					if(is_string($this->e[$k][$i])&&function_exists($this->e[$k][$i])) {
						$this->e[$k][$i]();
					} elseif(is_array($this->e[$k][$i])) {
						if(is_object($this->e[$k][$i][0])&&is_callable($this->e[$k][$i])) {
							call_user_func($this->e[$k][$i]);
						} elseif(is_string($this->e[$k][$i][0])&&is_object($this->m[$this->e[$k][$i][0]])) {
							call_user_func(array($this->m[$this->e[$k][$i][0]],$this->e[$k][$i][1]));
						} else {
							$this->msg('err','zZ','strange type of v at ee #1: '.gettype($this->e[$k][$i])).' '.$this->e[$k][$i][1];
						}
					} else { 
						$this->msg('err','zZ','strange type of v at ee #2: '.$this->e[$k][$i].' '.gettype($this->e[$k][$i]));
					}
				}

			} else {
				// void(0);
			}
		return $this;
		}
		
		/////////////////////////////// 
		// modules
		private $loa = array();
		public function lo($c=false,$a=false,$n=false) { // class, args, name, prop
			if(class_exists('\\za\\'.$c.'\\'.$c)) {
				if(isset($this->loa[$c])&&count($this->loa[$c])>0) { // mass loading
					foreach($this->loa[$c] as $v) {
						$a = $v[0]; $n = ($v[1])?$v[1]:$c; 
						$c = '\\za\\'.$c.'\\'.$c;
						$this->m[ $n ] = new $c($this,$a,$n);
						$this->ee( $n );
					}
					$this->loa[$c] = array();
				} else { // single loading
					$n = (($n)?$n:$c);
					$c = '\\za\\'.$c.'\\'.$c;
					$this->m[ $n ] = new $c($this,$a,$n);
					$this->ee( $c ); 
					if($c!=$n) { $this->ee( $n ); } else {}
				}
			} else {
				if(!isset($this->loa[$c])) {
					$fn = $this->cd.$this->dd.$c.$this->dd.$c.'.php';
					if(is_file($fn)) {
						$this->loa[$c][] = array($a,$n);
						// initiation inside $c
						\zlo::da($c,$this,'lo');					
						include_once($fn);
					} else {
						$this->msg('err','zZ','there is no class: '.$c);
					}
				} else {} 
			}
		return $this;
		}
		
		public function lo2($s) {
			$ix = count($s);
			for($i=0;$i<$ix;$i++) {
				$tmp = array_merge(explode(';', $s[$i]), array(false,false,false));
				$this->lo($tmp[0],$tmp[1],$tmp[2]);
			}
		}
		
		/////////////////////////////// 
		// funcs
		public function msg($c='err',$k=false,$v=false) { // err|ntf, module, text
			$this->mm(false,array('ca'=>'zmsg','cat'=>$c,'m'=>$k,'de'=>$v));
		}	

		public function a2x($a=false,$tab='') {
			$re = '';
			foreach($a as $k=>$v) {
				$k = (is_numeric($k))?'i':$k;
				$k = ((is_numeric(substr($k,0,1)))?'i':'').$k; // mb_substr
				if(is_array($v)) { 
					$re .= $tab."<".$k.">\n".$this->a2x($v,$tab."\t").$tab."</".$k.">\n";
				} else {
					$v = (!is_null($v))?preg_replace('/&[^(\w;)|(#0-9;)]/u','&amp; ',$v):'';
					$re .= $tab."<".$k.">".((strpos($v,'<')!==false||strpos($v,'>')!==false)?'<![CDATA[ '.$v.' ]]>':$v)."</".$k.">\n";
				}
			}
		return $re;
		}

		public function hdr($s='content-type:text/plain;charset=utf-8',$a=false) { // a - additional headers
			header($s);
			header('Server: Morkovka');
			header('X-Powered-By: Zagata.Rock');
			if(is_array($a)) {
				$ix = count($a);
				for($i=0;$i<$ix;$i++) {
					header($a[$i]);
				}
			} else {}
			// cookie?
			// session?
		}

		public function dbg($s) {
			$this->hdr();
			print_r($s);
			exit();
		}
		
		//check if xml is valid document
		public function vldxml($xml) {
			$doc = @simplexml_load_string($xml);
			if ($doc) {
				return true; //this is valid
			} else {
				return false; //this is not valid
			}
		}
		
		/////////////////////////////// 
		// ini
		function __construct($ini=false) {

			$this->cmn = false;
			$this->cd = realpath( __DIR__.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR );
			$this->dd = DIRECTORY_SEPARATOR;

			// default sys encodings
			if($ini) {
				$this->mm('vrs',$ini);
			} else {}
		}
		
	}


////////////////////////////////////////////////////////////////

	if(realpath(__FILE__) == realpath($_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_NAME'])) {
		header("content-type: text/plain;charset=utf-8");
		exit('zZ');
	} else {}

}

?>