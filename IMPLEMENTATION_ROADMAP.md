# Violin Mentor Implementation Roadmap

## Purpose

This is the canonical plan for future Violin Mentor development. It begins after
the currently shipped foundation and turns broad product ideas into sequenced,
testable releases.

The roadmap should be reviewed after every major release. A phase may move only
when its release gate is satisfied; attractive new features do not bypass
reliability, pedagogy, privacy, or accessibility work.

## Product North Star

Help a violin student start the right practice, receive trustworthy feedback,
fix the most important mistake, and understand their improvement without needing
to plan the session alone.

Primary success measure:

- Weekly learners who complete at least three purposeful practice sessions.

Supporting measures:

- Diagnostic-to-first-plan completion.
- Daily-plan completion.
- Seven-day and thirty-day learner retention.
- Percentage of detected mistakes that improve during the same session.
- Intonation and rhythm improvement across four weeks.
- Lesson completion without frustration exits.
- Teacher and parent review frequency.
- Accessibility and microphone-success rates.

## Shipped Foundation

The following capabilities are complete and are not future scope:

- Public Progressive Web App and production deployment workflow.
- Guided lessons, repertoire library, tuner, metronome, and practice tools.
- Real practice-session recording and progress summaries.
- Three-minute pitch, rhythm, and reading diagnostic.
- Adaptive 10, 15, and 20-minute daily practice plans.
- Real-time Pitch Orbit intonation coaching.
- Automatic rescue repetitions for difficult notes.
- Longitudinal Intonation Insights by note, string, finger, and session.

## Prioritization Rules

Work is selected using four scores from 1–5:

- **Learner value:** expected improvement to learning outcomes or practice
  consistency.
- **Differentiation:** how difficult the experience is to replace with a generic
  music-learning product.
- **Business value:** effect on retention, conversion, teacher adoption, or
  expansion.
- **Effort:** implementation, content, validation, and operational cost. Lower
  effort is preferable.

When scores are close, prioritize trustworthy feedback and shorter time to
musical improvement over catalog size or cosmetic gamification.

## Phase 0 — Reliability, Safety, and Measurement

**Target:** next 2–4 weeks  
**Why first:** every audio, camera, adaptive, and paid feature depends on
trustworthy sessions and measurable outcomes.

### P0.1 Audio calibration

- Add a thirty-second microphone and room-noise check.
- Detect clipping, weak input, excessive background noise, and unsupported
  browser conditions.
- Calibrate device latency before rhythm scoring.
- Let learners replay a sample to confirm that the microphone hears the violin.
- Provide a text-only fallback path when microphone access is unavailable.

Acceptance checks:

- Calibration completes on current Chrome, Safari, and mobile browsers.
- Permission denial has a recoverable explanation.
- No practice result is recorded when the signal is below the confidence floor.
- Latency and signal-quality metadata are stored with the session.

### P0.2 Practice-event data model

- Version all practice records.
- Store note, timing, pitch-confidence, exercise, device, and calibration
  metadata consistently.
- Add migration handling for older browser records.
- Define deletion and export behavior for every stored data category.
- Add analytics events without storing raw microphone audio by default.

Acceptance checks:

- Old local profiles open without data loss.
- Every new coach writes a versioned session.
- Export produces a human-readable file.
- Deleting a profile removes its associated local practice records.

### P0.3 Quality and observability

- Add automated tests for diagnostic, plan, tuner, coach, insights, lessons,
  authentication boundaries, and offline behavior.
- Add browser-level happy-path tests for the daily plan and microphone fallback.
- Add anonymized error monitoring and performance measurements.
- Set budgets for initial load, route load, and audio-start latency.

Release gate:

- No critical or high-severity known defects.
- Core test suite passes in continuous integration.
- Direct links and offline launch work.
- Audio failures produce actionable recovery guidance.

### P0.4 Accessibility and child safety baseline

- Complete keyboard, screen-reader, contrast, reduced-motion, and zoom audits.
- Provide captions/transcripts for instructional media.
- Never require color alone to communicate pitch or rhythm.
- Separate child profiles from adult account and billing controls.
- Document microphone, camera, and analytics consent in plain language.

Release gate:

- Core flows meet WCAG 2.2 AA.
- A learner can finish the diagnostic and daily plan without sound-only or
  color-only instructions.

## Phase 1 — Rhythm and Bow-Control Coach

**Target:** weeks 4–10  
**Priority:** highest-value new learning feature.

### P1.1 Rhythm Pulse

- Listen for note onsets against a metronome and expected rhythm.
- Display early, centered, and late timing in milliseconds.
- Require a stable run, not one lucky attempt.
- Offer tempo choices and automatic slowdown after repeated misses.
- Generate a rescue loop from the weakest measure or rhythm cell.
- Save timing distribution and tempo to longitudinal insights.

### P1.2 Bow Lane

- Start with audio-derived bow-change and sustain consistency.
- Score smooth starts, unwanted gaps, scratch/noise bursts, and note duration.
- Give one correction at a time, such as slower bow, steadier contact, or a
  cleaner bow change.
- Add optional camera feedback only after explicit consent and feasibility
  validation.

### P1.3 Rhythm and bow insights

- Show timing bias, tempo stability, repeated weak patterns, and improvement.
- Compare separate bowing patterns and strings.
- Add rhythm and bow tasks to the adaptive daily plan.

Acceptance checks:

- Known test recordings score within an agreed timing tolerance.
- Device latency is removed from learner timing scores.
- Rescue loops select the actual weakest pattern.
- Completing a coach updates the daily plan and progress history.
- Guidance never claims visual posture analysis when only audio was used.

Success measures:

- Same-session weak-pattern improvement.
- Reduced early/late timing spread across four weeks.
- Percentage of learners completing the rescue loop.

## Phase 2 — Mistake Memory and Adaptive Teaching

**Target:** weeks 8–14

### P2.1 Personal mistake bank

- Maintain a weighted history of difficult notes, fingers, intervals, rhythms,
  measures, and bow changes.
- Decay old weaknesses after repeated successful sessions.
- Distinguish an isolated miss from a recurring misconception.
- Allow learners to mark feedback as unhelpful or caused by detection error.

### P2.2 Next-best-action engine

- Blend diagnostic results, recent sessions, goals, available time, fatigue, and
  repertoire deadlines.
- Adapt duration and difficulty rather than only changing the activity.
- Explain every recommendation in plain language.
- Prevent repetitive plans with spacing and variety rules.
- Provide safe overrides: easier, harder, different skill, or less time.

### P2.3 Mastery model

- Define observable mastery for pitch, rhythm, reading, technique, and
  repertoire.
- Use confidence ranges rather than treating one score as truth.
- Unlock harder work only after stable evidence across sessions.
- Schedule retrieval practice before a skill is likely to be forgotten.

Acceptance checks:

- Identical history produces a deterministic plan.
- Recommendations always include a traceable reason.
- The plan never exceeds the learner’s selected time.
- A detection-confidence failure cannot lower mastery.
- Unit tests cover progression, regression, variety, and override rules.

## Phase 3 — Curriculum and Repertoire Depth

**Target:** months 3–6

### P3.1 Structured curriculum

- Map every lesson to level, prerequisite, technique, rhythm, reading, and
  musical-expression outcomes.
- Add beginner, returning-player, exam-preparation, and adult-restart paths.
- Create checkpoint performances with clear rubrics.
- Add remediation lessons for each checkpoint failure.

### P3.2 Repertoire system

- Expand public-domain and properly licensed music across classical, folk,
  film-inspired, world, and contemporary styles.
- Add searchable metadata for level, technique, mood, duration, key, and range.
- Support MusicXML ingestion with validation and editor review.
- Provide accompaniment, count-in, loop, tempo, fingering, and bowing layers.
- Clearly display source and licensing information.

### P3.3 Musicality coaching

- Teach dynamics, phrasing, articulation, tone color, and musical intent.
- Compare a learner take with multiple valid interpretations instead of one
  rigid “correct” performance.
- Let learners annotate phrases and choose an expressive goal.

Acceptance checks:

- Every published lesson has outcomes, prerequisites, source rights, and QA
  approval.
- Imported scores fail safely when unsupported.
- Accompaniment stays synchronized after tempo changes and looping.
- Curriculum checkpoints produce targeted remediation.

## Phase 4 — Teacher, Parent, and Studio Workflows

**Target:** months 5–8

### P4.1 Teacher workspace

- Create students, groups, assignments, due dates, and practice expectations.
- Review recordings or note-level summaries with learner consent.
- Add timestamped teacher comments and demonstration clips.
- Compare assigned goals with actual practice without rewarding raw screen time.
- Export studio progress reports.

### P4.2 Parent experience

- Weekly plain-language summaries focused on effort, consistency, and the next
  supportive action.
- Controls for reminders, privacy, social features, and purchases.
- Multiple child profiles with separate progress.
- Avoid public rankings and discouraging comparisons.

### P4.3 Learner–teacher handoff

- Turn teacher assignments into daily-plan tasks.
- Let learners send a selected performance, not their entire history.
- Show whether automated feedback and teacher feedback agree or conflict.
- Preserve teacher authority over technique and injury-related guidance.

Acceptance checks:

- Role permissions are tested for learner, parent, teacher, and administrator.
- A teacher cannot access an unassigned learner.
- Learners can see exactly what will be shared before sending.
- Account deletion and studio removal revoke access promptly.

Business measures:

- Active studios.
- Assigned-work completion.
- Weekly teacher review rate.
- Learner retention in teacher-connected accounts.

## Phase 5 — Motivation, Performance, and Community

**Target:** months 6–9

### P5.1 Performance Studio

- Add distraction-free takes, count-in, accompaniment, and optional recording.
- Support side-by-side take comparison.
- Create shareable private recital links with expiration controls.
- Generate a pre-performance warm-up from the selected piece.

### P5.2 Healthy motivation

- Use streak repair, flexible weekly goals, and comeback plans.
- Reward meaningful practice behaviors: rescue completion, slow practice,
  reflection, and consistency.
- Add personal quests and seasonal repertoire journeys.
- Avoid addictive notifications, punitive streak loss, and pay-to-win rankings.

### P5.3 Safe community

- Begin with opt-in teacher or family circles.
- Add moderated challenges based on completion and creativity, not raw score.
- Require reporting, blocking, age-aware defaults, and moderation operations
  before public posting.
- Delay open social feeds until child-safety requirements are independently
  reviewed.

Acceptance checks:

- Shared performances are private by default.
- Expired or revoked links stop working.
- Notification frequency is user-controlled.
- Community features have moderation and abuse-response procedures before
  launch.

## Phase 6 — Multimodal AI Mentor

**Target:** months 8–12  
**Dependency:** reliable audio/vision confidence, privacy controls, and the
mastery model.

### P6.1 Evidence-grounded mentor

- Answer questions using the learner’s current lesson, practice history, and
  vetted violin pedagogy.
- Cite the observed note, rhythm, or measure behind advice.
- Admit uncertainty and recommend a teacher when evidence is weak.
- Never diagnose pain or injury; provide an explicit professional-help path.

### P6.2 Camera technique lab

- Optional on-device or privacy-preserving analysis for bow direction, bow
  placement, violin angle, and left-hand frame.
- Calibration for camera position, handedness, body proportions, and lighting.
- Confidence-aware feedback with replayable evidence.
- Delete raw video automatically unless the learner explicitly saves it.

### P6.3 Conversational practice

- Voice-controlled looping, tempo changes, and “show me again.”
- Short spoken cues timed between attempts, never over the student’s playing.
- Adjustable coaching personality and verbosity.
- Multilingual explanations while keeping musical notation consistent.

Acceptance checks:

- Advice is grounded in a visible or audible observation.
- Low-confidence analysis is withheld.
- Camera use is opt-in per session.
- Safety evaluation covers minors, harassment, self-harm, and medical claims.
- AI output undergoes pedagogy review before broad release.

## Phase 7 — Platform, Accessibility, and Global Reach

**Target:** months 9–14

### P7.1 Native-quality PWA and offline practice

- Cache selected lessons, accompaniment, plans, and recent insights.
- Queue practice records safely while offline.
- Resolve sync conflicts across devices.
- Add install, update, storage, and offline-status guidance.

### P7.2 Localization

- Complete product translation beyond navigation labels.
- Localize dates, practice guidance, notation conventions, and accessibility
  text.
- Add culturally relevant, properly licensed repertoire.
- Review translations with musicians, not only general translators.

### P7.3 Inclusive learning modes

- Dyslexia-friendly notation and text options.
- Large-type, high-contrast, reduced-motion, and one-handed navigation modes.
- Visual metronome and haptic rhythm where supported.
- Alternate explanations for younger learners, adults, and neurodiverse users.

Acceptance checks:

- Offline sessions sync exactly once.
- Locale changes do not break stored plans or lesson identifiers.
- Core flows pass accessibility review in every supported language.
- Storage limits and downloads are understandable and reversible.

## Phase 8 — Sustainable Business and Growth

**Target:** introduced gradually after Phase 2 demonstrates retention.

### P8.1 Packaging

- **Free:** diagnostic, tuner, starter curriculum, limited daily plan, and basic
  progress.
- **Premium learner:** full curriculum, advanced coaches, deeper analytics,
  repertoire, accompaniment, and offline downloads.
- **Family:** multiple learners, parent summaries, and household controls.
- **Teacher/studio:** assignments, review tools, groups, and reporting.

### P8.2 Conversion principles

- Let learners experience a real feedback-and-improvement loop before a paywall.
- Never paywall safety, data export, account deletion, or accessibility.
- Explain subscription value by outcomes, not a long feature checklist.
- Offer transparent trials, renewal reminders, and easy cancellation.

### P8.3 Growth loops

- Teacher invitations and studio onboarding.
- Private performance sharing.
- Ethical referral rewards.
- Searchable educational content and public-domain repertoire pages.
- School and community-program pilots.

Acceptance checks:

- Entitlement logic is server-authoritative.
- Billing, refunds, trials, and cancellation are tested.
- Child accounts cannot purchase without adult authorization.
- Experiments have guardrails for retention quality and learner well-being.

## Phase 9 — Advanced Differentiators

**Target:** research track after core retention and feedback accuracy are proven.

- Ensemble mode with synchronized parts and accompaniment.
- Teacher-authored adaptive exercises and reusable studio curricula.
- Audition and exam simulations with rubric-based feedback.
- Expressive-performance maps for dynamics, phrasing, and tone.
- Wearable or haptic integrations for pulse and posture prompts.
- Privacy-preserving aggregate learning research.
- Verified content marketplace with rights management and educator revenue share.

Research gate:

- Prototype demonstrates measurable learner value.
- Detection quality works across representative devices and environments.
- Rights, privacy, moderation, and operational costs are understood.
- The feature strengthens the core practice loop rather than distracting from it.

## Cross-Cutting Engineering Tracks

These are continuous requirements, not standalone later phases.

### Architecture

- Keep audio analysis, coaching rules, mastery, and UI independently testable.
- Version stored records and plan algorithms.
- Use feature flags for risky releases.
- Keep microphone and camera processing local by default where practical.

### Security and privacy

- Minimize personal data and retention.
- Encrypt sensitive cloud data in transit and at rest.
- Use least-privilege role access.
- Maintain consent, export, deletion, incident-response, and vendor-review
  procedures.

### Pedagogy

- Review curriculum and automated feedback with qualified violin teachers.
- Test instructions with beginners before scaling.
- Prefer one actionable correction at a time.
- Measure transfer to repertoire, not only exercise scores.

### Content operations

- Track source, license, arranger, version, level, and QA status.
- Separate draft, reviewed, and published content.
- Provide rollback for lesson and score updates.

### Analytics and experimentation

- Define events before implementation.
- Use cohort retention and learning improvement together.
- Do not optimize only for session length or notification clicks.
- Document experiments, guardrails, and stopping rules.

## Ranked Enhancement Backlog

| Rank | Enhancement | Learner value | Differentiation | Business value | Effort | Planned phase |
|---:|---|---:|---:|---:|---:|---|
| 1 | Rhythm Pulse with latency calibration | 5 | 5 | 5 | 4 | 1 |
| 2 | Bow Lane audio feedback | 5 | 5 | 5 | 5 | 1 |
| 3 | Personal mistake bank | 5 | 5 | 5 | 3 | 2 |
| 4 | Mastery-based adaptive plans | 5 | 5 | 5 | 4 | 2 |
| 5 | Structured curriculum checkpoints | 5 | 4 | 5 | 4 | 3 |
| 6 | Teacher assignments and review | 5 | 4 | 5 | 5 | 4 |
| 7 | Repertoire and accompaniment depth | 4 | 3 | 5 | 5 | 3 |
| 8 | Performance take comparison | 4 | 4 | 4 | 3 | 5 |
| 9 | Parent summaries and controls | 4 | 3 | 4 | 3 | 4 |
| 10 | Evidence-grounded AI mentor | 4 | 5 | 4 | 5 | 6 |
| 11 | Camera technique feedback | 5 | 5 | 4 | 5 | 6 |
| 12 | Offline multi-device practice | 4 | 3 | 4 | 4 | 7 |
| 13 | Localization and inclusive modes | 4 | 3 | 4 | 4 | 7 |
| 14 | Healthy quests and recital sharing | 3 | 3 | 4 | 3 | 5 |
| 15 | Studio subscriptions | 3 | 3 | 5 | 4 | 8 |

## Immediate Implementation Sprint

The next sprint starts Phase 0 and de-risks Phase 1.

1. Define versioned audio-event and calibration types.
2. Build microphone signal-quality and latency calibration.
3. Add a reusable onset detector with fixture-based tests.
4. Prototype Rhythm Pulse using quarter and eighth-note patterns.
5. Record early/late timing and rescue-loop details.
6. Add rhythm results to the adaptive plan and progress area.
7. Run a teacher review of feedback language and timing tolerances.

Sprint exit criteria:

- A learner can calibrate, play a four-bar rhythm, see early/late feedback, and
  repeat the weakest bar.
- The result is saved as a versioned real practice session.
- Tests cover latency correction, onset matching, skips, and low-confidence
  input.
- The feature is keyboard accessible and usable without relying on color.

## Definition of Done for Every Initiative

- User problem and intended learning outcome are documented.
- Acceptance checks and analytics are defined before implementation.
- Product copy states what is measured and what is inferred.
- Unit tests cover business and coaching logic.
- Core integration path is tested.
- Keyboard, screen-reader, contrast, motion, and mobile behavior are reviewed.
- Privacy and child-safety impact is assessed.
- Empty, error, permission-denied, offline, and low-confidence states work.
- Existing stored data remains compatible.
- Build, lint, tests, and production packaging pass.
- Release is observable, reversible, and documented.

## Release Checklist

- Confirm feature flag and rollout audience.
- Confirm content and pedagogy approval.
- Confirm browser/device support matrix.
- Confirm monitoring and error-recovery copy.
- Confirm data retention, export, and deletion behavior.
- Confirm public routes and offline fallback.
- Publish a saved, validated production version.
- Review learning and reliability measures after 24 hours, 7 days, and 30 days.

