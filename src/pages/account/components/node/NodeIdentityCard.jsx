import { CopyableField } from "../shared/CopyableField";
import { shortenId } from "../../utils/ipfs";

/**
 * Identity block for the node. Lays out the PeerID and two multiaddrs as
 * copyable chips, same way IPFS Desktop and Kubo gateways show them.
 */
export const NodeIdentityCard = ({ peerId, multiaddrs }) => (
  <div className="space-y-3">
    <div>
      <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/55">
        Peer ID
      </p>
      <div className="mt-1.5">
        <CopyableField
          value={peerId}
          label="peer ID"
          displayValue={shortenId(peerId, 10, 8)}
        />
      </div>
    </div>

    <div>
      <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/55">
        Addresses
      </p>
      <ul className="mt-1.5 space-y-1.5">
        {multiaddrs.map((addr) => (
          <li key={addr}>
            <CopyableField
              value={addr}
              label="multiaddr"
              displayValue={shortenId(addr, 24, 14)}
              className="w-full"
            />
          </li>
        ))}
      </ul>
    </div>
  </div>
);
