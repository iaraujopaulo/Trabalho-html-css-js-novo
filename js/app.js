(()=>{
const L=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
const S=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const users=()=>L('volts_usuarios')||[];
const sessao=()=>sessionStorage.getItem('volts_sessao');
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const msg=(t,ok)=>{const m=$('msg');if(m){m.textContent=t;m.className='mensagem '+(ok?'ok':'erro')}};
const MODELOS={'Volts E1':['Compacto urbano','imagens/volts-e1.svg'],'Volts X':['SUV elétrico','imagens/volts-x.svg'],'Volts GT':['Esportivo de luxo','imagens/volts-gt.svg']};
const page=document.body.dataset.page;

// menu das páginas novas
const h=$('topo');
if(h){const on=sessao();
 h.className='topo';
 h.innerHTML='<a class="logo" href="index.html">VOLTS MOTORS</a><button class="burger" aria-label="Abrir menu">&#9776;</button><nav><a href="index.html">Home</a><a href="tecnologia.html">Tecnologia</a><a href="modelos.html">Modelos</a><a href="sobre.html">Sobre</a><a href="contato.html">Contato</a>'+(on?'<a class="btn" href="pedido.html">Meu pedido</a><a class="btn" href="#" id="sair">Sair</a>':'<a class="btn" href="create-account.html">Criar conta</a><a class="btn" href="login.html">Entrar</a>')+'</nav>';
 h.querySelector('.burger').onclick=()=>h.querySelector('nav').classList.toggle('aberto');
 if($('sair'))$('sair').onclick=e=>{e.preventDefault();sessionStorage.removeItem('volts_sessao');location.href='index.html'};
 const cur=location.pathname.split('/').pop()||'index.html';
 h.querySelectorAll('nav a:not(.btn)').forEach(a=>{if(a.getAttribute('href')===cur)a.style.color='#E15F09'});
}

// cadastro: guarda no navegador (localStorage)
if(page==='cadastro')$('form-cadastro').addEventListener('submit',e=>{
 e.preventDefault();
 const f=e.target,email=f.email.value.trim().toLowerCase();
 if(!f.nome.value.trim())return msg('Informe seu nome.',0);
 if(f.senha.value!==f.confirmar.value)return msg('As senhas não conferem.',0);
 const us=users();
 if(us.some(u=>u.email===email))return msg('Este e-mail já está cadastrado.',0);
 us.push({nome:f.nome.value.trim(),sobrenome:f.sobrenome.value.trim(),email,senha:f.senha.value});
 S('volts_usuarios',us);
 msg('Cadastrado!',1);f.reset();
 setTimeout(()=>location.href='login.html',1500);
});

// login com o e-mail e a senha cadastrados
if(page==='login'){
 const f=$('form-login'),lem=localStorage.getItem('volts_lembrar');
 if(lem){f.email.value=lem;$('Save-login').checked=true}
 f.addEventListener('submit',e=>{
  e.preventDefault();
  const em=f.email.value.trim().toLowerCase();
  if(!users().length)return msg('Nenhuma conta cadastrada. Crie sua conta primeiro.',0);
  if(!users().find(u=>u.email===em&&u.senha===f.senha.value))return msg('E-mail ou senha incorretos.',0);
  if($('Save-login').checked)localStorage.setItem('volts_lembrar',em);else localStorage.removeItem('volts_lembrar');
  sessionStorage.setItem('volts_sessao',em);
  location.href='pedido.html';
 });
}

// alteração de senha
if(page==='senha')$('form-senha').addEventListener('submit',e=>{
 e.preventDefault();
 const f=e.target,em=f.email.value.trim().toLowerCase(),us=users(),u=us.find(x=>x.email===em);
 if(!u)return msg('E-mail não cadastrado.',0);
 if(f.senha.value!==f.confirmar.value)return msg('As senhas não conferem.',0);
 u.senha=f.senha.value;S('volts_usuarios',us);
 msg('Senha alterada',1);f.reset();
 setTimeout(()=>location.href='login.html',1500);
});

// contato
if(page==='contato'){
 const t=$('telefone');
 t.addEventListener('input',()=>{
  const d=t.value.replace(/\D/g,'').slice(0,11),c=d.length>10?7:6;
  t.value=d.length>c?`(${d.slice(0,2)}) ${d.slice(2,c)}-${d.slice(c)}`:d.length>2?`(${d.slice(0,2)}) ${d.slice(2)}`:d;
 });
 $('form-contato').addEventListener('submit',e=>{e.preventDefault();msg('Formulário enviado',1);e.target.reset()});
}

// pedido do comprador
if(page==='pedido'){
 const em=sessao(),u=users().find(x=>x.email===em);
 if(!u){location.href='login.html';return}
 $('dados').innerHTML=`<dt>Nome</dt><dd>${esc(u.nome)}</dd><dt>Sobrenome</dt><dd>${esc(u.sobrenome||'-')}</dd><dt>E-mail</dt><dd>${esc(u.email)}</dd>`;
 const mo=$('modelo'),an=$('ano'),ped=()=>(L('volts_pedidos')||{});
 const prev=()=>{const m=MODELOS[mo.value];$('prev-img').src=m[1];$('prev-tipo').textContent=m[0]};
 const sal=()=>{const p=ped()[em];$('salvo').textContent=p?`Pedido salvo: ${p.modelo} ${p.ano} em ${p.data}`:'Nenhum pedido salvo ainda.'};
 if(ped()[em]){mo.value=ped()[em].modelo;an.value=ped()[em].ano}
 mo.onchange=prev;prev();sal();
 $('form-pedido').addEventListener('submit',e=>{
  e.preventDefault();
  const o=ped();o[em]={modelo:mo.value,ano:an.value,data:new Date().toLocaleDateString('pt-BR')};
  S('volts_pedidos',o);sal();msg('Pedido salvo com sucesso!',1);
 });
}
})();
