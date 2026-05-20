import { parseReviewReport, sha256 } from './designer-review.ts';

export interface PromotionGateResult {
  ok: boolean;
  failures: string[];
  gateChecks: {
    markerPresent: boolean;
    statusApproved: boolean;
    reportSha256Match: boolean;
  };
}

export function verifyPromotionGates(input: {
  reportMarkdown: string;
  approvedMarkerExists: boolean;
  reportPath: string;
}): PromotionGateResult {
  const failures: string[] = [];
  const gateChecks = {
    markerPresent: false,
    statusApproved: false,
    reportSha256Match: false,
  };

  // Gate 1: .approved marker must exist
  if (input.approvedMarkerExists) {
    gateChecks.markerPresent = true;
  } else {
    failures.push('Gate 1 failed: .approved marker does not exist');
  }

  // Parse the report for gates 2 and 3
  let parsed;
  try {
    parsed = parseReviewReport(input.reportMarkdown, input.reportPath);
  } catch (err) {
    failures.push(`Gate 2/3 failed: could not parse report frontmatter — ${String(err)}`);
    return { ok: false, failures, gateChecks };
  }

  // Gate 2: status must be approved
  const status = parsed.frontmatter.status;
  if (status === 'approved') {
    gateChecks.statusApproved = true;
  } else {
    failures.push(`Gate 2 failed: status is ${status}, expected approved`);
  }

  // Gate 3: reportSha256 in frontmatter must match sha256 of body
  const expectedSha = sha256(parsed.body);
  if (parsed.frontmatter.reportSha256 === expectedSha) {
    gateChecks.reportSha256Match = true;
  } else {
    failures.push(
      `Gate 3 failed: reportSha256 mismatch — stored=${parsed.frontmatter.reportSha256}, computed=${expectedSha}`
    );
  }

  return {
    ok: failures.length === 0,
    failures,
    gateChecks,
  };
}
