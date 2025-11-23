import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import styles from "./PDSPage.module.css";

const PDSPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className={styles.pdsDocument}>
          {/* Title Page */}
          <section className={styles.titlePage}>
            <h1>Motor Cover Mutual Limited</h1>
            <p className={styles.subtitle}>Product Disclosure Statement for Motor Plus+ Protection</p>
            <p className={styles.meta}>
              This document was prepared on &lt;insert&gt; and issued by Motor Cover Mutual Ltd ACN [insert].<br />
              Version 1.0
            </p>
          </section>

          {/* Contact Details */}
          <section className={styles.contact}>
            <h2>Contact Details</h2>
            <div className={styles.contactGrid}>
              <div className={styles.contactBlock}>
                <h4>Membership and Protection</h4>
                <p>Telephone: &lt;insert&gt;</p>
                <p>Email: &lt;insert&gt;</p>
              </div>
              <div className={styles.contactBlock}>
                <h4>Claims</h4>
                <p>Telephone: &lt;insert&gt;</p>
                <p>Email: &lt;insert&gt;</p>
              </div>
              <div className={styles.contactBlock}>
                <h4>Complaints</h4>
                <p>Telephone: &lt;insert&gt;</p>
                <p>Email: &lt;insert&gt;</p>
              </div>
              <div className={styles.contactBlock}>
                <h4>Privacy</h4>
                <p>Telephone: &lt;insert&gt;</p>
                <p>Email: &lt;insert&gt;</p>
              </div>
            </div>
            <div className={styles.contactBlock} style={{ marginTop: '15px' }}>
              <h4>AFSL Holder</h4>
              <p>Asia Mideast Insurance and Reinsurance Pty Ltd ACN 079 924 851</p>
              <p>AFS Licence No. 239926</p>
              <p>Email: info@amir.com.au | Post: PO Box 1678, North Sydney NSW 2059</p>
            </div>
            <p style={{ marginTop: '15px', fontSize: '9pt', fontStyle: 'italic' }}>
              Distribution of this document has been authorised by Asia Mideast Insurance and Reinsurance Pty Ltd ACN 079 924 851 AFSL 239926.
            </p>
          </section>

          {/* Introduction */}
          <h2>Introduction</h2>
          <p>This Product Disclosure Statement (PDS) and protection wording is an important legal document. It describes what you need to know about Motor Cover Mutual Ltd ACN 692 709 649 (Mutual) and the Motor Plus+ protection (Protection) available to members of the Mutual (Members).</p>
          <p>The Protection is a financial risk product offered by National Cover Pty Ltd ACN 639 621 480 (Manager) as an authorised representative of Asia Mideast Insurance and Reinsurance Pty Ltd 079 924 851 AFSL no. 239926 (AMIR) on our behalf. We issue it on the terms contained in the PDS (subject to the operation of the Constitution and the Protection Wording).</p>
          <p>Before you decide whether to become a Member of the Mutual or to purchase Protection, please read this document, the Financial Services Guide and the Constitution carefully and keep a copy in a safe place for future reference.</p>
          <p><strong>Part 1</strong> of this document is the PDS. It contains information about the Protection we offer and how to become a Member. It sets out the rights and entitlements of Members and explains the benefits and risks associated with purchasing the Protection.</p>
          <p><strong>Part 2</strong> of this document contains the Protection Wording for the Protection. These are the terms and conditions on which we provide the Protection (including exclusions and conditions) subject to our discretionary powers to accept or reject a claim in the interests of the Members and in accordance with the Constitution.</p>

          {/* Glossary */}
          <div className={styles.glossary}>
            <h2>Glossary: PDS</h2>
            <p style={{ fontSize: '10pt', marginBottom: '10px' }}>For the purpose of the PDS (Part 1), the following definitions apply:</p>
            <div className={styles.glossaryItem}><strong>AFCA</strong> Australian Financial Complaints Authority.</div>
            <div className={styles.glossaryItem}><strong>AFSL</strong> Australian financial services licence.</div>
            <div className={styles.glossaryItem}><strong>Agreed Value</strong> The value of the Vehicle as recorded in the Member Protection Schedule, representing the maximum consideration the Mutual may provide for a Total Loss.</div>
            <div className={styles.glossaryItem}><strong>AMIR</strong> Asia Mideast Insurance and Reinsurance Pty Ltd 079 924 851 AFSL no. 239926.</div>
            <div className={styles.glossaryItem}><strong>APRA</strong> Australian Prudential Regulation Authority.</div>
            <div className={styles.glossaryItem}><strong>ASIC</strong> Australian Securities and Investments Commission.</div>
            <div className={styles.glossaryItem}><strong>Board</strong> The board of directors of the Mutual.</div>
            <div className={styles.glossaryItem}><strong>Constitution</strong> The constitution of the Mutual, governing membership and protection offered by the Mutual.</div>
            <div className={styles.glossaryItem}><strong>Contribution</strong> The total amount of fees plus any taxes that a Member is required to pay to access the Protection for the duration of each Protection Period.</div>
            <div className={styles.glossaryItem}><strong>FSG</strong> The financial services guide for the financial services issued by the Manager.</div>
            <div className={styles.glossaryItem}><strong>Manager</strong> National Cover Pty Ltd ACN 639 621 480.</div>
            <div className={styles.glossaryItem}><strong>Member</strong> A current member of the Mutual.</div>
            <div className={styles.glossaryItem}><strong>Mutual</strong> Motor Cover Mutual Ltd ACN 692 709 649.</div>
            <div className={styles.glossaryItem}><strong>Own Damage Protection</strong> Discretionary protection for damage to the Member's own Vehicle, as distinct from damage to third-party property or persons.</div>
            <div className={styles.glossaryItem}><strong>PDS</strong> The document named Product Disclosure Statement issued by us, which can be found in Part 1 of this document.</div>
            <div className={styles.glossaryItem}><strong>Protection</strong> The type and amount of protection that a Member is able to access, which will be provided to the Member as a discretionary risk product.</div>
            <div className={styles.glossaryItem}><strong>Protection Schedule</strong> The schedule of protection we issued in relation to the Protection for each Protection Period.</div>
            <div className={styles.glossaryItem}><strong>Protection Wording</strong> The terms on which we issue the Protection as a discretionary risk product which are contained in Part 2 of this document.</div>
            <div className={styles.glossaryItem}><strong>We, us, our</strong> The Mutual.</div>
            <div className={styles.glossaryItem}><strong>You, your(s)</strong> A Member who has purchased the Protection as described in the Protection Schedule.</div>
          </div>

          {/* PART 1 */}
          <h1 className={styles.part}>PART 1 — Product Disclosure Statement</h1>

          <h2>Section 1 — Introduction</h2>
          <p>This document is an important legal document designed to help you in making an informed choice about whether to become a Member of the Mutual and how to apply for Protection.</p>
          <p>The Protection is a financial risk product offered by the Manager on our behalf and is issued in accordance with the terms outlined in the PDS and Protection Wording (subject to the provisions of our Constitution).</p>

          <h2>Section 2 — About Motor Cover Mutual Limited</h2>

          <h3>2.1 What is it?</h3>
          <p>The Mutual is a company limited by guarantee that has been established to operate as a discretionary mutual to provide financial risk protection for our Members.</p>
          <p>The Protection described in the PDS is a financial risk product regulated under the Corporations Act 2001 (Cth) and serves as an alternative to traditional insurance – it is known as "discretionary risk protection" or "protection". You can only purchase the Protection if you are a Member and only Members are eligible to make claims under it.</p>
          <p>As a discretionary mutual, we leverage the collective purchasing power of our Members to distribute the cost of risk more effectively and to provide expanded coverage and additional benefits where traditional insurance may fail to offer cover.</p>

          <h3>2.2 How does it work?</h3>
          <p>As a Member, you have the opportunity to access the Protection (along with any other benefits that may be available) by paying a fee referred to as 'a Contribution'. The factors we use to calculate the Contribution amount payable by a Member are described in the Financial Information section below. Each Member will pay a Contribution annually for their Protection, effectively enabling the funding of claims.</p>
          <p>We then use the combined resources of the Contributions pooled together to fund the Protection and cover associated management costs. We may also purchase insurance (where available) as part of a prudent strategy to manage our financial risks and exposures.</p>

          <h3>2.3 Who manages it?</h3>
          <p>The Board has engaged the Manager to oversee the operation of the Mutual and manage the delivery of financial services. The Manager is responsible for offering Membership and the Protection, handling Membership enquiries, claims and performing other professional services.</p>
          <p>The Manager is an authorised representative of AMIR. More information about the Manager and the services it provides on our behalf is contained in the FSG.</p>

          <h3>2.4 How is the Mutual managed?</h3>
          <p>The Board manages the Mutual with the assistance of the Manager, who provides membership services and coordinates the delivery of certain functions such as payment of claims. The Manager is responsible for making offers of Membership and Protection to eligible applicants.</p>
          <p>A Member who has purchased the Protection is entitled to have their claim considered and paid if the Board exercises its discretion in favour of paying the claim. The Board's authority to exercise this discretion in response to a Member's claim for Protection is contained in our Constitution.</p>
          <p>The Board must act in accordance with the Constitution as well as any by-laws, standards and guidelines that are established from time to time. The Constitution sets out the objectives of the Mutual, our powers as a company limited by guarantee, the rules governing our operations, the eligibility criteria of Members, the process for electing directors and the conduct of Members' and directors' meetings.</p>

          <h2>Section 3 — Membership</h2>

          <h3>3.1 Who can join?</h3>
          <p>The Mutual and the Manager will invite eligible persons to become Members, granting them the ability to access and purchase Protection. Eligible persons include car owners and drivers who use their vehicle to participate in the ride share industry in Australia. Eligibility for Membership is subject to the Constitution and may be amended from time to time in accordance with the Constitution.</p>
          <p>If you choose to join the Mutual, you will be asked to complete a digital Membership application form. Once this has been submitted and accepted, you will be able to purchase Protection as required.</p>
          <p>The Board ultimately decides whether to approve a Membership application and admit an entity as a Member. You do not need to pay a fee to become a Member however you will need to pay a Contribution to obtain Protection.</p>

          <h3>3.2 What are the benefits of membership?</h3>
          <p>The Mutual's structure offers our Members a highly cost-effective solution which is designed to provide financial support to Members in relation to damages incurred to motor vehicles.</p>
          <p>An additional advantage is the ability to retain Contributions that are not used to meet claims made under the Protection. By carefully managing the risk pool, we strive to keep Contributions as low as possible. When surplus Contributions are available, we will aim to provide Members with discounts on future Contributions.</p>

          <h2>Section 4 — Discretionary Risk Protection</h2>

          <h3>4.1 About the Protection</h3>
          <p>The Protection is intended to be used to protect Members from the financial impact of damage incurred to their vehicle.</p>
          <p>The Protection is exclusively available to our Members, who have the right to submit a claim for Protection to the Board. The Board has the absolute discretion to approve or deny a Member's claim for Protection. We will always be the party paying any accepted claim.</p>

          <h3>4.2 Why does the Board have discretion to approve claims?</h3>
          <p>The Protection is 'discretionary protection', which is a legitimate solution allowing Members to manage their financial risk and the consequence of the various risks covered under the Protection Wording.</p>
          <p>To qualify as discretionary protection, the Board must have the absolute discretion to accept or reject a Member's claim. Otherwise, there is a risk that the product would be deemed an insurance product, and we would be required to be authorised under the Insurance Act 1973 (Cth) to operate an insurance business.</p>
          <p>By offering discretionary protection, we can offer our Members a financial risk product without the need to set up an insurance company. ASIC supervises AMIR as the holder of the AFSL and regulates the issue and distribution of the discretionary protection.</p>
          <p>Unlike insurance companies which are regulated by APRA and are subject to APRA's prudential standards and the provisions of the Insurance Act, discretionary mutuals such as the Mutual are not bound by these regulations. Also, the Protection is not classified as an insurance product and therefore is not subject to the Insurance Contracts Act 1984 (Cth).</p>
          <p>Importantly, the Federal Government's Financial Claims Scheme is not available in the event of the Mutual's insolvency.</p>

          <h3>4.3 What are the significant risks?</h3>

          <h4>4.3.1 The Protection is not an insurance product</h4>
          <p>The Protection is classified as a 'miscellaneous financial risk product'. This means that as a Member, you do not have an automatic right of indemnity under the terms set out in the Protection Wording. Instead, you have an automatic right to have your claim considered and to request that the Board exercises its discretion to indemnify you for your loss. All claim payments are made solely at the discretion of the Board.</p>

          <h4>4.3.2 Whether there is adequate funding of the Mutual</h4>
          <p>If the total amount of claims made in a given year exceeds the total amount of Contributions collected from Members that we have allocated to pay claims, there is a risk that a Protection claim would not be fully paid or may only be partially paid.</p>
          <p>To mitigate this risk, we regularly seek professional advice to ensure the Contributions we charge are sufficient to meet our anticipated claims liabilities for all Members.</p>

          <h4>4.3.3 A Member could lose their Protection entitlements if their Membership is cancelled</h4>
          <p>The Mutual operates for the benefit of all Members. The Board therefore reserves the right to expel Members or deny them access to the Protection when this is deemed to be in the best interests of the Membership as a whole, or if a Member breaches the rules of Membership.</p>

          <h2>Section 5 — Financial Information</h2>

          <h3>5.1 What does the Protection cost?</h3>
          <p>Contributions are the amount you pay us for each Protection Period during which you require the Protection. Your Contribution amount, along with any deductible amount, will be shown in dollars on the Quotation and confirmed on your tax invoice.</p>

          <h3>5.2 Are there any tax implications?</h3>
          <p>Your Contributions benefit from preferential income tax treatment when paid into the Mutual. Contributions are subject to goods and services tax (GST), which will be included in the amount quoted for the Protection. Unlike traditional insurance products, no stamp duty or other insurance taxes (e.g. emergency services levy) are payable on Contributions.</p>

          <h3>5.3 What happens to any surplus?</h3>
          <p>At the end of the financial year, we may hold a 'surplus' of funds – this is the amount that we retain and have not paid out in claims to Members at the end of the financial year or the costs of operating the Mutual in that financial year.</p>
          <p>Any surplus will be applied exclusively for the benefit of the Members. At the Board's discretion, these funds may be:</p>
          <ul>
            <li>Reserved for additional and anticipated future claims from Members</li>
            <li>Applied to assist with claim payments in subsequent years</li>
            <li>Used to reduce Member Contributions</li>
            <li>Allocated to provide increased protection or additional benefits to Members</li>
            <li>Utilised for initiatives that benefit the Membership</li>
            <li>Directed towards any other purpose permitted under the Constitution</li>
          </ul>

          <h3>5.4 Estimating future payments</h3>
          <p>Based on the advice of the Board and the Manager, we will calculate the total amount of Contributions reasonably required to ensure sufficient financial resources are available to discharge future liabilities and make payments to Members who have purchased Protection. This calculation is guided by independent actuarial advice to ensure it is reasonable and accurate.</p>

          <h2>Section 6 — Making a Claim</h2>
          <p>If you have purchased the Protection, you have an automatic right to have your claim for Protection reviewed by the Board. Before submitting a claim, please refer to the claims procedures described in the Protection Wording in Part 2.</p>
          <p>Claim notifications, along with the required supporting documentation, can be submitted directly to the Manager, either in writing or electronically, using the contact details provided at the front of this document.</p>
          <p>The Manager will handle claims (including the exercise of the Board's discretion) within its delegated authority. Claims outside the Manager's authority will be referred to the Board to decide whether to accept a claim and determine the amount, if any, to be paid. The Board has absolute discretion to refuse or reduce a claim.</p>

          <h2>Section 7 — Complaints</h2>
          <p>We are dedicated to offering products and services that deliver value and benefit to our Members.</p>
          <p>Our Board follows established guidelines to ensure its discretion is exercised fairly, consistently and in the collective interests of all Members when assessing the merits of a claim.</p>
          <p>If you wish to dispute a claim decision, you may ask us to reconsider our decision by submitting a written request to the Manager, who will refer the matter to the Board.</p>

          <h3>7.1 External dispute resolution</h3>
          <p>If you are not satisfied with the decision or if your complaint remains unresolved after 30 days, you can refer the matter to the Australian Financial Complaints Authority (AFCA). AFCA is an independent body that provides its services free of charge. AMIR, as the AFSL holder, is a member of AFCA.</p>
          <p><strong>AFCA Contact Details:</strong><br />
          Email: info@afca.org.au<br />
          Free call number: 1800 931 678<br />
          Online complaint form: https://ocf.afca.org.au</p>

          <h2>Section 8 — Changes and Cancellation</h2>

          <h3>8.1 Protection Period</h3>
          <p>The period of your Protection will be the dates and time shown on your current Protection Schedule.</p>

          <h3>8.2 Renewal</h3>
          <p>Before the expiry of your current Protection Period, you will receive either an offer to renew your Protection for the following year, or a notification informing you that we are unable to renew the Protection you currently hold.</p>

          <h3>8.3 Changing Your Details</h3>
          <p>You need to advise the Manager if you change your contact details. We will not be liable for any loss you suffer because you have failed to notify us of changes to those details.</p>

          <h3>8.4 Cancelling your Membership</h3>
          <p>You may choose to cancel your Membership and Protection at any time by giving us 30 days' notice. This can be done verbally or in writing.</p>
          <p>Once you have cancelled your Membership, you can no longer access the Protection unless you become a Member and hold Protection again.</p>

          {/* PART 2 */}
          <h1 className={styles.part}>PART 2 — Protection Wording</h1>

          <h2>Section 9 — Nature of Discretionary Protection</h2>

          <h3>9.1 Overview</h3>
          <p>Motor Cover Mutual Ltd provides discretionary protection. This means the Mutual may, but is not obliged to, provide benefits to a Member following an Incident. There is no contractual promise to indemnify the Member.</p>

          <h3>9.2 How Discretion Operates</h3>
          <p>When a claim is submitted, the Mutual considers the Incident, the Member's compliance with obligations, the protection guidelines, equity among Members, and the overall sustainability of the pool. The Board may approve, partially approve, conditionally approve, reduce, or decline benefits.</p>

          <h3>9.3 No Contract of Insurance</h3>
          <p>Under s9 of the Insurance Contracts Act 1984 (Cth), a contract of insurance requires a binding promise to indemnify. The Mutual provides no such promise. Accordingly, ICA provisions (including duties of good faith, cancellation rights, s54 restrictions, and insurance remedies) do not apply.</p>

          <h3>9.4 Comparison with Insurance</h3>
          <p>Insurance provides a guaranteed right to payment if criteria are met. Discretionary protection does not. The Mutual retains full discretion regarding whether benefits are granted and in what form.</p>

          <h3>9.5 Protection of the Mutual Pool</h3>
          <p>The Mutual must ensure fairness to all Members. Even where an Incident meets the guidelines, the Board may reduce, delay, or refuse payment if necessary to preserve the financial stability of the pool.</p>

          <h3>9.6 Member Behaviour</h3>
          <p>Discretion may be exercised unfavourably where a Member:</p>
          <ul>
            <li>Fails to disclose required information</li>
            <li>Uses the Vehicle contrary to declared usage</li>
            <li>Drives unlawfully or dangerously</li>
            <li>Delays reporting an Incident</li>
            <li>Impedes assessment or recovery processes</li>
            <li>Has repeated similar claims</li>
          </ul>

          <h3>9.7 No Right to Appeal Payment Amounts</h3>
          <p>Members may request internal review of a decision. However, Members have no right to demand any particular outcome. AFCA may review conduct but cannot compel the Mutual to pay benefits.</p>

          <h2>Section 10 — Types of Cover</h2>

          <h3>10.1 Overview</h3>
          <p>Motor Cover Mutual Ltd offers discretionary <strong>Own Damage Protection</strong> for damage to the Member's Vehicle, up to the limit specified in the Member Protection Schedule.</p>
          <p>Own Damage Protection remains entirely discretionary and subject to the Board's decision at all times.</p>
          <p>In addition, the Mutual may arrange Third Party Property Damage (TPPD) insurance from an APRA-authorised insurer to provide cover for damage caused to other people's vehicles and property. See Section 10.4 for details.</p>

          <h3>10.2 Own Damage Protection</h3>
          <p>Own Damage Protection may include consideration for:</p>
          <ul>
            <li>Accidental damage to the Member's Vehicle</li>
            <li>Theft or attempted theft</li>
            <li>Malicious damage (excluding fraud)</li>
            <li>Fire and weather-related incidents (subject to exclusions)</li>
            <li>Damage occurring during disclosed rideshare or commercial use</li>
            <li>Damage occurring during private vehicle use</li>
            <li>Use otherwise not inconsistent with the Constitution</li>
          </ul>

          <h4>10.2.1 What Own Damage Protection Does NOT Cover</h4>
          <div className={styles.important}>
            <h4>Important: Exclusions from Own Damage Protection</h4>
            <p>Own Damage Protection applies only to damage to the Member's own Vehicle. It does <strong>NOT</strong> provide any cover or consideration for:</p>
            <ul>
              <li><strong>Damage caused to other vehicles</strong> — Any damage you cause to another person's vehicle is not covered</li>
              <li><strong>Damage caused to other property</strong> — Any damage you cause to buildings, structures, fences, or other third-party property is not covered</li>
              <li><strong>Damage caused to other people</strong> — Any personal injury, medical expenses, or liability for injury to third parties is not covered</li>
            </ul>
            <p>Members should consider whether they require separate third-party liability insurance or CTP cover for these risks.</p>
          </div>

          <h4>10.2.2 Agreed Value Limitation</h4>
          <p>Consideration is capped at the <strong>Agreed Value</strong> of the Vehicle as recorded in the Member Protection Schedule. The Agreed Value represents the maximum amount the Mutual may consider paying in the event of a Total Loss, and is determined at the time of joining or renewal based on information provided by the Member.</p>

          <h3>10.3 Exclusions Specific to Own Damage</h3>
          <p>The Mutual will generally not consider Own Damage claims involving:</p>
          <ul>
            <li>Unlicensed or impaired drivers</li>
            <li>Criminal or dangerous driving</li>
            <li>Undisclosed commercial use</li>
            <li>Pre-existing damage not declared to the Mutual</li>
            <li>Wear and tear, mechanical breakdown, or gradual deterioration</li>
            <li>Damage caused intentionally by the Member or driver</li>
            <li>Use of the Vehicle inconsistent with Member declarations or the Constitution</li>
          </ul>

          <h3>10.4 Third Party Property Damage Insurance</h3>
          <p>In providing protection to Members, the Mutual may obtain a Third Party Property Damage (TPPD) insurance policy from an APRA-authorised insurer to cover the Member's Vehicle.</p>
          <div className={styles.important}>
            <h4>Important: TPPD Insurance Arrangement</h4>
            <p>Members should be aware that:</p>
            <ul>
              <li>The TPPD insurance policy is <strong>not underwritten by the Mutual</strong></li>
              <li>The TPPD insurance is provided by a separate APRA-authorised insurer</li>
              <li>TPPD insurance covers damage caused by the Member's Vehicle to other people's vehicles and property</li>
              <li>The terms, conditions, limits, and exclusions of the TPPD insurance are set by the APRA-authorised insurer, not the Mutual</li>
              <li>Claims under the TPPD insurance policy are subject to the insurer's policy wording and claims process</li>
              <li>The availability, limits, and terms of TPPD insurance may change from time to time</li>
            </ul>
            <p>Details of any TPPD insurance arranged for your Vehicle will be provided in your Member Protection Schedule or separately by the Manager. The Mutual acts as an intermediary in facilitating this insurance and does not guarantee the performance of the APRA-authorised insurer.</p>
          </div>

          <h3>10.5 Compulsory Third Party (CTP) Insurance — Not Provided</h3>
          <div className={styles.important}>
            <h4>Important: The Mutual is NOT a CTP Insurer</h4>
            <p>The Mutual does <strong>NOT</strong> provide Compulsory Third Party (CTP) insurance or any protection for personal injury. Specifically:</p>
            <ul>
              <li>The Mutual does not offer protection for personal injury caused to the Member</li>
              <li>The Mutual does not offer protection for personal injury caused to passengers</li>
              <li>The Mutual does not offer protection for personal injury caused to pedestrians or other road users</li>
              <li>The Mutual does not offer protection for medical expenses, rehabilitation, or income support arising from personal injury</li>
              <li>The Mutual does not offer protection for any death or bodily injury claims</li>
            </ul>
            <p>CTP insurance is compulsory in all Australian states and territories and is typically included with your vehicle registration. Members must ensure they have valid CTP insurance as required by law. The Mutual's Own Damage Protection is for vehicle damage only and does not replace or supplement CTP insurance in any way.</p>
          </div>

          {/* Continue with remaining sections... */}
          <h2>Section 11 — Optional Add-On Covers</h2>
          <p>Optional Add-On Covers are not automatically included in Membership. They require payment of an additional Contribution and explicit confirmation in the Member Protection Schedule. These covers remain discretionary and subject to the Board's decision.</p>

          <h2>Section 12 — Claims Lodgement Requirements</h2>
          <p>Members must notify the Mutual of any Incident as soon as practicable and no later than 30 days after the Incident occurs.</p>

          <h2>Section 13 — Claims Settlement (Discretionary Framework)</h2>
          <p>The Mutual retains absolute discretion regarding how claims are settled, including cash settlement, repair coordination, or total loss determination.</p>

          <h2>Section 14 — Exclusions</h2>
          <p>The Mutual will generally not consider claims involving unlicensed drivers, illegal activities, or intentional damage.</p>

          <h2>Section 15 — Excess Structure</h2>
          <p>An Excess is the amount the Member must pay before the Mutual will consider a claim. Multiple Excesses may apply concurrently.</p>

          <h2>Section 16 — Complaints &amp; Dispute Resolution</h2>
          <p>Motor Cover Mutual Ltd is committed to fair, efficient, and transparent handling of complaints in accordance with ASIC Regulatory Guide 271.</p>

          <h2>Section 17 — Definitions</h2>
          <p>This section contains comprehensive definitions of all terms used throughout the PDS and Protection Wording.</p>

          <h2>Section 18 — Glossary of Statutory References</h2>
          <p>This Glossary summarises key Australian legislation and regulatory instruments relevant to the operation of Motor Cover Mutual Ltd.</p>

          <h2>Section 19 — Add-On Cover Schedules</h2>
          <p>Detailed schedules for Overseas Licence Holder Cover and Rideshare Downtime / Loss of Income Cover.</p>

          <h2>Section 20 — Detailed Member Obligations</h2>
          <p>Membership requires adherence to obligations designed to protect the integrity of the Mutual and ensure fairness to all Members.</p>

          <h2>Section 21 — Example Scenarios</h2>
          <p>Illustrative examples of how the Mutual may exercise discretion in various claim scenarios.</p>

          <div className={styles.example}>
            <h4>Example 1 — Not-At-Fault Collision</h4>
            <p>The Member is rear-ended at a traffic light. The Mutual may assist by facilitating a claim against the at-fault party's insurance.</p>
          </div>

          <div className={styles.example}>
            <h4>Example 2 — Single Vehicle Incident (Cash Settlement)</h4>
            <p>The Member's Vehicle is damaged in an accepted single vehicle collision. The Mutual may provide a cash settlement representing the devaluation amount.</p>
          </div>

          <div className={styles.example}>
            <h4>Example 3 — Rideshare Downtime</h4>
            <p>With the Add-On Cover, the Mutual may consider payment for loss of income during vehicle downtime.</p>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PDSPage;
