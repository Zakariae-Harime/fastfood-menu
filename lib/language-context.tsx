'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Ingredient, MenuCategory, MenuExtra, MenuItem } from '@/lib/types'

export type Language = 'fr' | 'darija'
type Messages = Record<string, string>

const STORAGE_KEY = 'snack-maestro-language-v1'

const messages: Record<Language, Messages> = {
  fr: {
    'language.label': 'Choisir la langue',
    'nav.home': 'Accueil',
    'nav.backHome': "Retour à l’accueil",
    'hero.tagline': 'Bocadillos & saveurs de Tanger',
    'hero.intro': 'Des bocadillos généreux, préparés à la minute avec des produits frais et le goût de Tanger.',
    'hero.menu': 'Voir le menu',
    'hero.route': 'Voir l’itinéraire',
    'hero.note': 'Commandez directement sur WhatsApp — pas de compte, pas de paiement en ligne.',
    'specialties.eyebrow': 'Les incontournables',
    'specialties.title': 'Les stars du comptoir',
    'specialties.all': 'Découvrir tout le menu',
    'values.title': 'L’esprit Maestro',
    'values.grilled.title': 'Grillé à la minute',
    'values.grilled.description': 'Chaque bocadillo est préparé à la commande, jamais à l’avance.',
    'values.fresh.title': 'Produits frais',
    'values.fresh.description': 'Légumes du marché, pain du jour et sauces maison.',
    'values.late.title': 'Ouvert tard',
    'values.late.description': 'Tous les jours de 11h00 jusqu’à 02h00 du matin.',
    'reviews.eyebrow': 'Vos mots, notre fierté',
    'reviews.title': 'Ils ont aimé',
    'reviews.cta': 'Laisser un avis sur Google',
    'reviews.rating': '{rating} étoiles sur 5',
    'contact.eyebrow': 'Au cœur de Tanger',
    'contact.title': 'Nous trouver',
    'contact.description': 'Lancez votre trajet en un geste ou repérez le snack directement sur la carte.',
    'map.placeTitle': 'Carte Google Maps de Snack Maestro à Tanger',
    'map.routeTitle': 'Itinéraire vers Snack Maestro depuis votre position',
    'map.yourRoute': 'Votre itinéraire',
    'map.reset': 'Revenir au plan',
    'map.locating': 'Localisation…',
    'map.refresh': 'Actualiser l’itinéraire',
    'map.route': 'Voir l’itinéraire',
    'map.open': 'Ouvrir Google Maps',
    'map.order': 'Commander sur WhatsApp',
    'map.permission': 'Autorisez l’accès à votre position dans votre navigateur, puis réessayez.',
    'map.timeout': 'Votre position met trop de temps à répondre. Réessayez dans un instant.',
    'map.unavailable': 'Votre position n’est pas disponible pour le moment. Vous pouvez ouvrir Google Maps à la place.',
    'map.unsupported': 'Votre navigateur ne permet pas de détecter votre position. Ouvrez Google Maps pour l’itinéraire.',
    'status.open': 'Ouvert maintenant',
    'status.closed': 'Fermé — réouvre à {time}',
    'qr.eyebrow': 'Scannez & commandez',
    'qr.title': 'Le menu dans votre poche',
    'qr.description': 'Pointez la caméra de votre téléphone sur le code pour ouvrir le menu et commander sur WhatsApp.',
    'qr.cardTitle': 'Menu Snack Maestro',
    'qr.cardDescription': 'Redirige directement vers le menu complet.',
    'qr.alt': 'QR code vers {url}',
    'qr.download': 'Télécharger le PNG',
    'qr.loading': 'Génération du QR code',
    'qr.print': 'QR codes à imprimer',
    'qr.printEyebrow': 'À imprimer',
    'qr.pageDescription': 'Scannez ou imprimez ce QR code pour vos tables, vitrines et flyers. Il redirige directement vers le menu.',
    'menu.title': 'Le menu',
    'menu.categories': 'Catégories du menu',
    'menu.search': 'Rechercher un plat ou un ingrédient',
    'menu.searchLabel': 'Rechercher dans le menu',
    'menu.clearSearch': 'Effacer la recherche',
    'menu.results': '{count} résultat(s)',
    'menu.error': 'Impossible de charger le menu. Veuillez réessayer.',
    'menu.empty': 'Aucun plat ne correspond à votre recherche.',
    'menu.customize': 'Personnaliser',
    'menu.add': 'Ajouter',
    'category.EntreesFroides': 'Entrées froides',
    'category.Pizza': 'Pizza',
    'category.SandwichsFrais': 'Sandwichs frais',
    'category.SandwichsChauds': 'Sandwichs chauds',
    'category.Panini': 'Panini',
    'category.Shawarma': 'Shawarma',
    'category.Tagine': 'Tagine',
    'category.Pasticcio': 'Pasticcio',
    'category.Pates': 'Les pâtes',
    'category.PlatsChauds': 'Plats chauds',
    'category.Foure': 'Fouré',
    'category.Hamburgers': 'Hamburgers',
    'category.Tacos': 'Tacos',
    'category.PlatsSpeciaux': 'Plats spéciaux',
    'category.Boissons': 'Boissons',
    'customize.label': 'Personnaliser {name}',
    'customize.close': 'Fermer',
    'customize.bread': 'Format / option',
    'customize.ingredients': 'Ingrédients',
    'customize.ingredientsHelp': 'Ajoutez, réduisez ou retirez (0) ce que vous voulez.',
    'customize.extras': 'Extras',
    'customize.quantity': 'Quantité',
    'customize.decrease': 'Réduire {name}',
    'customize.increase': 'Ajouter {name}',
    'customize.decreaseQuantity': 'Diminuer la quantité',
    'customize.increaseQuantity': 'Augmenter la quantité',
    'customize.addCart': 'Ajouter au panier',
    'cart.open': 'Ouvrir le panier, {count} articles, total {total}',
    'cart.title': 'Votre panier',
    'cart.itemCount': '{count} article(s)',
    'cart.close': 'Fermer le panier',
    'cart.empty': 'Votre panier est vide.',
    'cart.bread': 'Pain',
    'cart.without': 'Sans',
    'cart.extra': 'Extra',
    'cart.remove': 'Retirer {name} du panier',
    'cart.name': 'Votre nom',
    'cart.namePlaceholder': 'Ex : Youssef',
    'cart.note': 'Demande spéciale (facultatif)',
    'cart.notePlaceholder': 'Ex : sauce à part, bien grillé…',
    'cart.noteHelp': 'Ajoutez ici toute précision pour l’ensemble de la commande.',
    'cart.addNote': 'Ajouter une demande spéciale',
    'cart.hideNote': 'Masquer la demande spéciale',
    'cart.mode': 'Mode de commande',
    'cart.eatIn': 'Sur place',
    'cart.takeaway': 'À emporter',
    'cart.total': 'Total',
    'cart.order': 'Commander sur WhatsApp',
  },
  darija: {
    'language.label': 'اختار اللغة',
    'nav.home': 'الرئيسية',
    'nav.backHome': 'رجع للرئيسية',
    'hero.tagline': 'بوكاديو ومذاق طنجة',
    'hero.intro': 'بوكاديو عامر وبنين، كيتوجد فاللحظة بمنتوجات طرية وبنكهة طنجة.',
    'hero.menu': 'شوف المينيو',
    'hero.route': 'شوف الطريق',
    'hero.note': 'كوموندي مباشرة فالواتساب — بلا حساب وبلا خلص فالإنترنت.',
    'specialties.eyebrow': 'لي خاصك تجرب',
    'specialties.title': 'نجوم المينيو',
    'specialties.all': 'شوف المينيو كامل',
    'values.title': 'روح مايسترو',
    'values.grilled.title': 'مشوي فاللحظة',
    'values.grilled.description': 'كل بوكاديو كيتوجد ملي كتطلبو، ماشي واجد من قبل.',
    'values.fresh.title': 'منتوجات طرية',
    'values.fresh.description': 'خضرة السوق، خبز اليوم وصوصات ديال الدار.',
    'values.late.title': 'محلولين حتى معطل',
    'values.late.description': 'كل نهار من 11 دالصباح حتى 2 ديال الليل.',
    'reviews.eyebrow': 'كلامكم كيفرحنا',
    'reviews.title': 'عجبهم مايسترو',
    'reviews.cta': 'خلي رأيك فـ Google',
    'reviews.rating': '{rating} نجوم من 5',
    'contact.eyebrow': 'فقلب طنجة',
    'contact.title': 'فين تلقانا',
    'contact.description': 'طلق الطريق بضغطه وحدة ولا شوف بلاصتنا فالخريطة.',
    'map.placeTitle': 'خريطة سناك مايسترو فطنجة',
    'map.routeTitle': 'الطريق من بلاصتك لسناك مايسترو',
    'map.yourRoute': 'الطريق ديالك',
    'map.reset': 'رجع للخريطة',
    'map.locating': 'كنقلبو على بلاصتك…',
    'map.refresh': 'عاود حسب الطريق',
    'map.route': 'شوف الطريق',
    'map.open': 'حل Google Maps',
    'map.order': 'كوموندي فالواتساب',
    'map.permission': 'سمح للموقع يعرف بلاصتك من المتصفح وعاود جرب.',
    'map.timeout': 'بلاصتك تعطلات فالجواب. عاود جرب من بعد شوية.',
    'map.unavailable': 'ما قدرناش نعرفو بلاصتك دابا. تقدر تحل Google Maps.',
    'map.unsupported': 'المتصفح ديالك ما كيدعمش تحديد الموقع. حل Google Maps باش تشوف الطريق.',
    'status.open': 'محلولين دابا',
    'status.closed': 'مسدودين — نعاودو نحلو مع {time}',
    'qr.eyebrow': 'سكانيو وكوموندي',
    'qr.title': 'المينيو فجيبك',
    'qr.description': 'وجه كاميرا تلفونك للكود باش تحل المينيو وتكوموندي فالواتساب.',
    'qr.cardTitle': 'مينيو سناك مايسترو',
    'qr.cardDescription': 'كيديك مباشرة للمينيو كامل.',
    'qr.alt': 'كود QR للرابط {url}',
    'qr.download': 'حمّل PNG',
    'qr.loading': 'كنوجدو كود QR',
    'qr.print': 'كودات QR للطبع',
    'qr.printEyebrow': 'واجد للطبع',
    'qr.pageDescription': 'سكاني ولا طبع هاد الكود للطاولات والواجهة والفلايرات. كيديك مباشرة للمينيو.',
    'menu.title': 'المينيو',
    'menu.categories': 'أصناف المينيو',
    'menu.search': 'قلب على ماكلة ولا مكوّن',
    'menu.searchLabel': 'قلب فالمينيو',
    'menu.clearSearch': 'مسح البحث',
    'menu.results': '{count} نتيجة',
    'menu.error': 'ما قدرناش نحملو المينيو. عاود جرب.',
    'menu.empty': 'ما لقينا حتى ماكلة بهاد البحث.',
    'menu.customize': 'بدّل على حسابك',
    'menu.add': 'زيد',
    'category.EntreesFroides': 'السلطات',
    'category.Pizza': 'البيتزا',
    'category.SandwichsFrais': 'سندويتشات باردة',
    'category.SandwichsChauds': 'سندويتشات ساخنة',
    'category.Panini': 'بانيني',
    'category.Shawarma': 'شاورما',
    'category.Tagine': 'طاجين',
    'category.Pasticcio': 'باستيتشيو',
    'category.Pates': 'المعجنات',
    'category.PlatsChauds': 'الأطباق الساخنة',
    'category.Foure': 'فوري',
    'category.Hamburgers': 'البرغر',
    'category.Tacos': 'طاكوس',
    'category.PlatsSpeciaux': 'أطباق خاصة',
    'category.Boissons': 'المشروبات',
    'customize.label': 'بدّل {name}',
    'customize.close': 'سد',
    'customize.bread': 'اختار الحجم أو النوع',
    'customize.ingredients': 'المكونات',
    'customize.ingredientsHelp': 'زيد، نقص ولا حيد (0) اللي بغيتي.',
    'customize.extras': 'الزيادات',
    'customize.quantity': 'العدد',
    'customize.decrease': 'نقص {name}',
    'customize.increase': 'زيد {name}',
    'customize.decreaseQuantity': 'نقص العدد',
    'customize.increaseQuantity': 'زيد العدد',
    'customize.addCart': 'زيد للسلة',
    'cart.open': 'حل السلة، {count} حوايج، المجموع {total}',
    'cart.title': 'السلة ديالك',
    'cart.itemCount': '{count} حوايج',
    'cart.close': 'سد السلة',
    'cart.empty': 'السلة خاوية.',
    'cart.bread': 'الخبز',
    'cart.without': 'بلا',
    'cart.extra': 'زيادة',
    'cart.remove': 'حيد {name} من السلة',
    'cart.name': 'السميّة ديالك',
    'cart.namePlaceholder': 'مثلا: يوسف',
    'cart.note': 'طلب خاص (اختياري)',
    'cart.notePlaceholder': 'مثلا: الصوص بوحدو، طيبها مزيان…',
    'cart.noteHelp': 'كتب هنا أي ملاحظة كتخص الطلب كامل.',
    'cart.addNote': 'زيد ملاحظة للطلب',
    'cart.hideNote': 'خبي ملاحظة الطلب',
    'cart.mode': 'طريقة الطلب',
    'cart.eatIn': 'ناكل فالمحل',
    'cart.takeaway': 'نديه معايا',
    'cart.total': 'المجموع',
    'cart.order': 'كوموندي فالواتساب',
  },
}

interface LanguageContextValue {
  language: Language
  isRtl: boolean
  setLanguage: (language: Language) => void
  t: (key: string, values?: Record<string, string | number>) => string
  itemName: (item: MenuItem) => string
  ingredientName: (item: Ingredient | MenuExtra) => string
  categoryName: (category: MenuCategory) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr')

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'fr' || saved === 'darija') setLanguageState(saved)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.lang = language === 'darija' ? 'ar-MA' : 'fr'
    root.dir = language === 'darija' ? 'rtl' : 'ltr'
  }, [language])

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const value = useMemo<LanguageContextValue>(() => {
    const t = (key: string, values?: Record<string, string | number>) => {
      let text = messages[language][key] ?? messages.fr[key] ?? key
      if (values) {
        for (const [name, replacement] of Object.entries(values)) {
          text = text.replaceAll(`{${name}}`, String(replacement))
        }
      }
      return text
    }
    return {
      language,
      isRtl: language === 'darija',
      setLanguage,
      t,
      itemName: (item) => language === 'darija' ? item.name_darija : item.name_fr,
      ingredientName: (item) => language === 'darija' ? item.name_darija : item.name,
      categoryName: (category) => t(`category.${category}`),
    }
  }, [language, setLanguage])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
