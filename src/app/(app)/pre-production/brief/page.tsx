import { getActiveRequest, getBrief } from "@/lib/db";
import { Card, CardHeader } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { ReadOnlyField } from "@/components/ui/field";
import { StepActions } from "@/components/pre-production/step-actions";

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <span
          key={it}
          className="rounded-pill border border-border bg-bg px-2 py-1 text-caption text-text-sub"
        >
          {it}
        </span>
      ))}
    </div>
  );
}

export default function BriefPage() {
  const request = getActiveRequest();
  const brief = getBrief(request.id);

  const product = (brief?.product_info ?? {}) as {
    product?: string;
    category?: string;
    landing_url?: string;
    key_usps?: string[];
  };
  const seo = (brief?.seo_info ?? {}) as {
    meta_title?: string;
    meta_description?: string;
    keywords?: string[];
  };
  const ai = (brief?.audio_intelligence ?? {}) as {
    target_geography?: string;
    audience?: string;
    tone?: string;
    top_performer?: string;
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Product Information"
            badge={<Tag tone="blue">Auto-filled</Tag>}
          />
          <div className="grid grid-cols-2 gap-4 p-6">
            <ReadOnlyField label="Product" value={product.product} />
            <ReadOnlyField label="Category" value={product.category} />
            <ReadOnlyField
              label="Landing Page URL"
              value={product.landing_url}
              className="col-span-2"
            />
            <div className="col-span-2">
              <p className="mb-2 text-caption font-medium text-text-faint">Key USPs</p>
              <Chips items={product.key_usps ?? []} />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="SEO Information"
            badge={<Tag tone="blue">Auto-filled</Tag>}
          />
          <div className="flex flex-col gap-4 p-6">
            <ReadOnlyField label="Meta Title" value={seo.meta_title} />
            <ReadOnlyField label="Meta Description" value={seo.meta_description} />
            <div>
              <p className="mb-2 text-caption font-medium text-text-faint">Keywords</p>
              <Chips items={seo.keywords ?? []} />
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Audio & Intelligence"
            badge={<Tag tone="gray">AI</Tag>}
          />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <ReadOnlyField label="Target Geography" value={ai.target_geography} />
            <ReadOnlyField label="Audience" value={ai.audience} />
            <ReadOnlyField label="Tone" value={ai.tone} />
            <ReadOnlyField
              label="Top Performer"
              value={<span className="font-medium text-success">{ai.top_performer}</span>}
            />
          </div>
        </Card>
      </div>

      <StepActions
        backHref="/pipeline"
        backLabel="Reject"
        nextHref="/pre-production/format"
        nextLabel="Accept & Continue"
      />
    </div>
  );
}
