import { Badge, Button, Card, List } from 'glassform';
import { EMERGENCY_CONTACTS } from '../../data/emergencyContacts.js';
import Icon from '../Icon.jsx';

/** Tap-to-call emergency numbers. */
export default function EmergencyContacts() {
  const items = EMERGENCY_CONTACTS.map((c) => ({
    id: c.id,
    leading: (
      <span className="grid size-9 place-items-center rounded-xl bg-red-50 text-red-600">
        <Icon name="phone" size={18} />
      </span>
    ),
    title: c.name,
    subtitle: c.phone ? `${c.phone} · ${c.detail}` : c.detail,
    trailing: c.phone ? (
      <Button href={`tel:${c.phone}`} size="sm" aria-label={`Call ${c.name}, ${c.phone}`}>
        Call
      </Button>
    ) : (
      <Badge tone="neutral" size="sm">
        Number soon
      </Badge>
    ),
  }));

  return (
    <Card radius={22} title="Emergency numbers" subtitle="Tap to call" padding="sm" className="p-5">
      <List
        surface={false}
        items={items}
        density="compact"
        showChevron={false}
        className="-mx-2"
        classNames={{ subtitle: "whitespace-normal overflow-visible" }}
      />
    </Card>
  );
}
