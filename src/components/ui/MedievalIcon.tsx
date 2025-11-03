import Image from 'next/image';

export type IconName = 
  | 'alchemy' | 'axe' | 'beer-keg' | 'bow' | 'bridge' | 'cannon' | 'cart' 
  | 'castle' | 'catapult' | 'cauldron' | 'chainmail' | 'chest' | 'clown' 
  | 'coins' | 'crossbow' | 'crown' | 'cup' | 'elixir' | 'executioner' 
  | 'flag' | 'flail' | 'gate' | 'gem' | 'gold' | 'guillotine' | 'helmet' 
  | 'horn' | 'king' | 'knight' | 'lance' | 'mace' | 'map' | 'money-bag' 
  | 'pillory' | 'princess' | 'quill' | 'quiver' | 'rapier' | 'scroll' 
  | 'shield' | 'ship' | 'spellbook' | 'stall' | 'swords' | 'target' 
  | 'throne' | 'torch' | 'tower' | 'treasure' | 'trumpet' | 'writing';

interface MedievalIconProps {
  name: IconName;
  size?: number;
  className?: string;
  alt?: string;
}

const iconMap: Record<IconName, string> = {
  'alchemy': '12812.S2 - Alchemy.png',
  'axe': '12813.S2 - Axe.png',
  'beer-keg': '12814.S2 - Beer Keg.png',
  'bow': '12815.S2 - Bow.png',
  'bridge': '12816.S2 - Bridge.png',
  'cannon': '12817.S2 - Cannon.png',
  'cart': '12818.S2 - Cart.png',
  'castle': '12819.S2 - Castle.png',
  'catapult': '12820.S2 - Catapult.png',
  'cauldron': '12821.S2 - Cauldron.png',
  'chainmail': '12822.S2 - Chainmail.png',
  'chest': '12823.S2 - Chest.png',
  'clown': '12824.S2 - Clown.png',
  'coins': '12825.S2 - Coins.png',
  'crossbow': '12826.S2 - Crossbow.png',
  'crown': '12827.S2 - Crown.png',
  'cup': '12828.S2 - Cup.png',
  'elixir': '12829.S2 - Elixir.png',
  'executioner': '12830.S2 - Executioner.png',
  'flag': '12831.S2 - Flag.png',
  'flail': '12832.S2 - Flail.png',
  'gate': '12833.S2 - Gate.png',
  'gem': '12834.S2 - Gem.png',
  'gold': '12835.S2 - Gold.png',
  'guillotine': '12836.S2 - Guillotine.png',
  'helmet': '12837.S2 - Helmet.png',
  'horn': '12838.S2 - Horn.png',
  'king': '12839.S2 - King.png',
  'knight': '12840.S2 - Knight.png',
  'lance': '12841.S2 - Lance.png',
  'mace': '12842.S2 - Mace.png',
  'map': '12843.S2 - Map.png',
  'money-bag': '12844.S2 - Money Bag.png',
  'pillory': '12845.S2 - Pillory.png',
  'princess': '12846.S2 - Princess.png',
  'quill': '12847.S2 - Quill.png',
  'quiver': '12848.S2 - Quiver.png',
  'rapier': '12849.S2 - Rapier.png',
  'scroll': '12850.S2 - Scroll.png',
  'shield': '12851.S2 - Shield.png',
  'ship': '12852.S2 - Ship.png',
  'spellbook': '12853.S2 - Spellbook.png',
  'stall': '12854.S2 - Stall.png',
  'swords': '12855.S2 - Swords.png',
  'target': '12856.S2 - Target.png',
  'throne': '12857.S2 - Throne.png',
  'torch': '12858.S2 - Torch.png',
  'tower': '12859.S2 - Tower.png',
  'treasure': '12860.S2 - Treasure.png',
  'trumpet': '12861.S2 - Trumpet.png',
  'writing': '12862.S2 - Writing.png',
};

export function MedievalIcon({ name, size = 48, className = '', alt }: MedievalIconProps) {
  const fileName = iconMap[name];
  const imagePath = `/images/icons/${fileName}`;
  const altText = alt || name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <Image
      src={imagePath}
      alt={altText}
      width={size}
      height={size}
      className={className}
    />
  );
}

