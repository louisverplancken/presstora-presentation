'use strict';
const packages=[
{id:'basic',name:'Calculs',tag:'Le socle',intro:'Vos méthodes de fabrication deviennent vos prix.',features:['Moteur de calcul et simulations','Bibliothèque de fabrication','Ressources, contraintes et recettes','Imposition pour le chiffrage'],options:[['pdf','Outils PDF','Analyse et préparation des fichiers'],['sheet','Fiches de fabrication','Document de fabrication'],['quote','Générateur de devis','Document de devis']],note:'Générez vos documents, sans adopter tout un suivi de production.'},
{id:'commerce',name:'Boutique',tag:'Avec Calculs',intro:'Vos produits, accessibles à vos clients.',features:['Produits et options de vente','Gestion des commandes web','Suivi des livraisons','Connecteur de boutique <span class="included">INCLUS</span>'],options:[['b2b','Espaces clients professionnels','Catalogues privés et boutiques dédiées'],['webshop','Boutique clé en main','Prestation de mise en place']],note:'La personnalisation graphique s’ajoute avec l’offre Création.'},
{id:'edition',name:'Création',tag:'Utilisable seule',intro:'Vos créations deviennent personnalisables.',features:['Préparation des modèles personnalisables','Éditeur de personnalisation','Espace de ressources graphiques','Aperçus et génération PDF <span class="included">INCLUS</span>'],options:[['templates','Collection de modèles de graphistes','Collection prévue · Conditions à venir']],note:'Seule : création et personnalisation. Avec Boutique : vente en ligne.'},
{id:'gestion',name:'Gestion',tag:'Avec Calculs',intro:'Votre activité, du devis au travail terminé.',features:['Devis, travaux et facturation','Statistiques et suivi d’activité','Peppol / comptabilité <span class="included">INCLUS*</span>','Générateurs de devis et fiches de fabrication <span class="included">INCLUS</span>'],options:[['impose','Imposition de production','Composition et export PDF de l’imposition'],['planning','Planification de l’atelier','Capacités, horaires et disponibilités']],note:'* Connecteurs prévus dans l’offre. Services et frais tiers à préciser.'}
];
const selected=new Set(['basic']), options=new Set();
const byId=id=>document.getElementById(id);
byId('cards').innerHTML=packages.map(p=>`<article class="package ${p.id}" aria-labelledby="title-${p.id}"><div class="package-top"><div class="kicker"><span class="tag">${p.tag}</span></div><h3 id="title-${p.id}">${p.name}</h3><p class="intro">${p.intro}</p><button class="toggle" data-package="${p.id}" aria-pressed="false">Ajouter à ma sélection</button></div><div class="package-body"><div class="mini-title">DANS CETTE OFFRE</div><ul class="features">${p.features.map(f=>`<li>${f}</li>`).join('')}</ul><div class="addons"><div class="mini-title">POUR ALLER PLUS LOIN</div>${p.options.map(([id,label,desc])=>`<label class="option"><input type="checkbox" id="option-${id}" data-option="${id}" data-owner="${p.id}"><span>${label}<small data-description="${id}">${desc}</small></span></label>`).join('')}</div><p class="package-note">${p.note}</p></div></article>`).join('');
function getSummary(){
 const names=packages.filter(p=>selected.has(p.id)).map(p=>p.name);
 const extra=packages.flatMap(p=>p.options.filter(([id])=>options.has(id)).map(([,name])=>name));
 return {names,extra};
}
function update(){
 const required=selected.has('commerce')||selected.has('gestion');
 if(required) selected.add('basic');
 for(const p of packages){
  const button=document.querySelector(`[data-package="${p.id}"]`),on=selected.has(p.id);
  button.setAttribute('aria-pressed',String(on));button.disabled=p.id==='basic'&&required;
  button.textContent=button.disabled?'✓ Socle requis et sélectionné':on?'✓ Dans ma sélection':'＋ Ajouter à ma sélection';
  for(const [id,,desc] of p.options){
   const input=byId('option-'+id),included=selected.has('gestion')&&['sheet','quote'].includes(id);
   input.disabled=!on||included;input.checked=included||options.has(id);
   if(!on||included) options.delete(id);
   input.checked=included||options.has(id);
   const description=document.querySelector(`[data-description="${id}"]`);
   description.textContent=included?'Inclus avec Gestion':desc;
   input.closest('label').title=!on?'Sélectionnez cette offre pour ajouter cette option':'';
   description.classList.toggle('included',included);
  }
 }
 const {names,extra}=getSummary();
 byId('count').textContent=names.length;
 byId('selected-packages').innerHTML=names.length?names.map(name=>`<span class="chip">${name}</span>`).join(''):'<span>Aucune offre sélectionnée.</span>';
 byId('dependency').textContent=required?'Calculs est sélectionné une seule fois pour les offres Boutique et/ou Gestion.':selected.has('edition')&&!selected.has('basic')?'Création seule : création et personnalisation, sans chiffrage industriel ni boutique.':'Ajoutez les offres et les options adaptées à votre activité.';
 byId('selected-options').innerHTML=(selected.has('gestion')?'<p class="option-summary"><b>Inclus avec Gestion</b> Générateurs de devis et de fiches de fabrication.</p>':'')+(selected.has('commerce')?'<p class="option-summary"><b>Inclus avec Boutique</b> Connecteur de boutique.</p>':'')+(selected.has('edition')?'<p class="option-summary"><b>Inclus avec Création</b> Aperçus et génération PDF.</p>':'')+`<p class="option-summary"><b>Options sélectionnées</b> ${extra.length?extra.join(' · '):'Aucune pour le moment.'}</p>`;
 byId('total-label').textContent=`${names.length} offre${names.length>1?'s':''}${extra.length?' + '+extra.length+' option'+(extra.length>1?'s':''):''}`;
 byId('download').disabled=!names.length;
 byId('feedback').textContent='';
}
byId('cards').addEventListener('click',event=>{const button=event.target.closest('[data-package]');if(!button||button.disabled)return;const id=button.dataset.package;if(selected.has(id))selected.delete(id);else selected.add(id);update();});
byId('cards').addEventListener('change',event=>{const input=event.target;if(!input.matches('[data-option]'))return;if(input.checked)options.add(input.dataset.option);else options.delete(input.dataset.option);update();});
byId('reset').addEventListener('click',()=>{selected.clear();selected.add('basic');options.clear();update();byId('feedback').textContent='Sélection réinitialisée à Calculs.';});
byId('download').addEventListener('click',()=>{
 const {names,extra}=getSummary();
 const text=['PRESSTORA — MA SÉLECTION','Futures offres Presstora · Sans engagement','','OFFRES',...names.map(x=>'• '+x),'','INCLUSIONS',...(selected.has('commerce')?['• Connecteur de boutique']:[]),...(selected.has('gestion')?['• Générateurs de devis et de fiches de fabrication','• Peppol / comptabilité : périmètre et frais tiers à préciser']:[]),...(selected.has('edition')?['• Aperçus et génération PDF']:[]),'','OPTIONS',...(extra.length?extra.map(x=>'• '+x):["Aucune"]), '',byId('dependency').textContent,'','Tarifs et disponibilités à définir. Cette sélection n’est ni une commande ni un engagement.'].join('\n');
 const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Presstora-ma-selection.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);byId('feedback').textContent='Récapitulatif téléchargé. Aucun achat ni envoi effectué.';
});
update();
