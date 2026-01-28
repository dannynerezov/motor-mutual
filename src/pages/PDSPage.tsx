import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PDSTableOfContents } from "@/components/PDSTableOfContents";
import styles from "./PDSPage.module.css";

const PDSPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Mobile TOC - Accordion */}
        <div className="lg:hidden px-4 py-4">
          <PDSTableOfContents mobile />
        </div>
        
        {/* Desktop Layout with Sidebar */}
        <div className="lg:flex lg:gap-8 max-w-[1400px] mx-auto px-4">
          {/* Desktop TOC - Sticky Sidebar */}
          <aside className="hidden lg:block lg:w-[280px] lg:shrink-0">
            <PDSTableOfContents />
          </aside>
          
          {/* Main Content */}
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
            <section id="contact-details" className={styles.contact}>
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
            <section id="introduction">
              <h2>Introduction</h2>
              <p>This Product Disclosure Statement (PDS) and protection wording is an important legal document. It describes what you need to know about Motor Cover Mutual Ltd ACN 692 709 649 (Mutual) and the Motor Plus+ protection (Protection) available to members of the Mutual (Members).</p>
              <p>The Protection is a financial risk product offered by National Cover Pty Ltd ACN 639 621 480 (Manager) as an authorised representative of Asia Mideast Insurance and Reinsurance Pty Ltd 079 924 851 AFSL no. 239926 (AMIR) on our behalf. We issue it on the terms contained in the PDS (subject to the operation of the Constitution and the Protection Wording).</p>
              <p>Before you decide whether to become a Member of the Mutual or to purchase Protection, please read this document, the Financial Services Guide and the Constitution carefully and keep a copy in a safe place for future reference.</p>
              <p><strong>Part 1</strong> of this document is the PDS. It contains information about the Protection we offer and how to become a Member. It sets out the rights and entitlements of Members and explains the benefits and risks associated with purchasing the Protection.</p>
              <p><strong>Part 2</strong> of this document contains the Protection Wording for the Protection. These are the terms and conditions on which we provide the Protection (including exclusions and conditions) subject to our discretionary powers to accept or reject a claim in the interests of the Members and in accordance with the Constitution.</p>
            </section>

            {/* Glossary */}
            <div id="glossary" className={styles.glossary}>
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
            <h1 id="part-1" className={styles.part}>PART 1 — Product Disclosure Statement</h1>

            <section id="section-1">
              <h2>Section 1 — Introduction</h2>
              <p>This document is an important legal document designed to help you in making an informed choice about whether to become a Member of the Mutual and how to apply for Protection.</p>
              <p>The Protection is a financial risk product offered by the Manager on our behalf and is issued in accordance with the terms outlined in the PDS and Protection Wording (subject to the provisions of our Constitution).</p>
            </section>

            <section id="section-2">
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
            </section>

            <section id="section-3">
              <h2>Section 3 — Membership</h2>

              <h3>3.1 Who can join?</h3>
              <p>The Mutual and the Manager will invite eligible persons to become Members, granting them the ability to access and purchase Protection. Eligible persons include car owners and drivers who use their vehicle to participate in the ride share industry in Australia. Eligibility for Membership is subject to the Constitution and may be amended from time to time in accordance with the Constitution.</p>
              <p>If you choose to join the Mutual, you will be asked to complete a digital Membership application form. Once this has been submitted and accepted, you will be able to purchase Protection as required.</p>
              <p>The Board ultimately decides whether to approve a Membership application and admit an entity as a Member. You do not need to pay a fee to become a Member however you will need to pay a Contribution to obtain Protection.</p>

              <h3>3.2 What are the benefits of membership?</h3>
              <p>The Mutual's structure offers our Members a highly cost-effective solution which is designed to provide financial support to Members in relation to damages incurred to motor vehicles.</p>
              <p>An additional advantage is the ability to retain Contributions that are not used to meet claims made under the Protection. By carefully managing the risk pool, we strive to keep Contributions as low as possible. When surplus Contributions are available, we will aim to provide Members with discounts on future Contributions.</p>
            </section>

            <section id="section-4">
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
            </section>

            <section id="section-5">
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
            </section>

            <section id="section-6">
              <h2>Section 6 — Making a Claim</h2>
              <p>If you have purchased the Protection, you have an automatic right to have your claim for Protection reviewed by the Board. Before submitting a claim, please refer to the claims procedures described in the Protection Wording in Part 2.</p>
              <p>Claim notifications, along with the required supporting documentation, can be submitted directly to the Manager, either in writing or electronically, using the contact details provided at the front of this document.</p>
              <p>The Manager will handle claims (including the exercise of the Board's discretion) within its delegated authority. Claims outside the Manager's authority will be referred to the Board to decide whether to accept a claim and determine the amount, if any, to be paid. The Board has absolute discretion to refuse or reduce a claim.</p>
            </section>

            <section id="section-7">
              <h2>Section 7 — Complaints</h2>
              <p>We are dedicated to offering products and services that deliver value and benefit to our Members.</p>
              <p>Our Board follows established guidelines to ensure its discretion is exercised fairly, consistently and in the collective interests of all Members when assessing the merits of a claim.</p>
              <p>If you wish to dispute a claim decision, you may ask us to reconsider our decision by submitting a written request to the Manager, who will refer the matter to the Board.</p>

              <h3 id="section-7-1">7.1 Internal Dispute Resolution</h3>
              <p>The Mutual maintains an internal dispute resolution (IDR) procedure in compliance with <strong>section 912A(1)(g) of the Corporations Act 2001 (Cth)</strong>, which requires financial services licensees to have adequate arrangements for handling complaints from members and other persons.</p>
              
              <h4>Step 1 — Lodge Your Complaint</h4>
              <p>You may lodge a complaint by phone, email, online helpdesk, or in writing. When lodging your complaint, please provide:</p>
              <ul>
                <li>Your name and contact details</li>
                <li>A clear explanation of your complaint</li>
                <li>Your desired outcome</li>
                <li>Any supporting evidence or documentation</li>
              </ul>

              <h4>Step 2 — Acknowledgement</h4>
              <p>Your complaint will be acknowledged within <strong>one business day</strong> (verbally or in writing). You will receive a reference number for tracking purposes.</p>

              <h4>Step 3 — Investigation</h4>
              <p>A dedicated Customer Relations Specialist will investigate your complaint. This may include:</p>
              <ul>
                <li>Reviewing relevant policies and documentation</li>
                <li>Contacting you if additional information is required</li>
                <li>Consulting with relevant departments or third parties as needed</li>
              </ul>

              <h4>Step 4 — Resolution & Outcome</h4>
              <p>You will receive a written decision that includes:</p>
              <ul>
                <li>Our findings and conclusions</li>
                <li>Clear reasons if the complaint is not upheld</li>
                <li>Details of any remedial action to be taken</li>
                <li>Information about external dispute resolution options if you remain unsatisfied</li>
              </ul>

              <h3 id="section-7-2">7.2 External Dispute Resolution</h3>
              <p>If you are not satisfied with the decision or if your complaint remains unresolved after 30 days, you can refer the matter to the Australian Financial Complaints Authority (AFCA). AFCA is an independent body that provides its services free of charge. AMIR, as the AFSL holder, is a member of AFCA.</p>
              <p><strong>AFCA Contact Details:</strong><br />
              Email: info@afca.org.au<br />
              Free call number: 1800 931 678<br />
              Online complaint form: https://ocf.afca.org.au</p>
            </section>

            <section id="section-8">
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
            </section>

            {/* PART 2 */}
            <h1 id="part-2" className={styles.part}>PART 2 — Protection Wording</h1>

            <section id="section-9">
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

              <h3>9.7 Claim Decision Review</h3>
              <p>The Mutual retains full discretion in relation to all claim decisions. Members may request an internal review of a decision in accordance with the Mutual's internal dispute resolution procedures. As a discretionary mutual fund, the Mutual is not legally obliged to approve or settle any claim and may, at its discretion, decline or vary a claim, subject always to the terms of the Constitution and this Product Disclosure Statement.</p>
            </section>

            <section id="section-10">
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
            </section>

            <section id="section-11">
              <h2>Section 11 — Optional Add-On Covers</h2>

              <h3>11.1 Overview</h3>
              <p>Optional Add-On Covers are not automatically included in Membership. They require payment of an additional Contribution and explicit confirmation in the Member Protection Schedule. These covers remain discretionary and subject to the Board's decision.</p>

              <h3>11.2 Overseas Licence Holder Cover</h3>

              <h4>11.2.1 Purpose</h4>
              <p>This Add-On may allow consideration of claims involving drivers who hold legally valid overseas licences, provided such drivers are declared, licensed correctly for the jurisdiction, and meet all applicable rideshare platform requirements.</p>

              <h4>11.2.2 Member Requirements</h4>
              <p>Members must:</p>
              <ul>
                <li>Declare all overseas-licensed drivers</li>
                <li>Provide copies or translations of licences as required</li>
                <li>Ensure the driver complies with road laws and platform obligations</li>
              </ul>

              <h4>11.2.3 Discretionary Limits</h4>
              <p>The Board may decline a claim involving an overseas licence holder where:</p>
              <ul>
                <li>The licence is not valid or recognised</li>
                <li>Translation or verification is insufficient</li>
                <li>The driver breached platform or licensing rules</li>
                <li>The driver's history materially increases risk</li>
              </ul>

              <h3>11.3 Rideshare Downtime / Loss of Income Cover</h3>

              <h4>11.3.1 Purpose</h4>
              <p>This Add-On may provide discretionary financial benefits for economic loss suffered when the Vehicle cannot be used for rideshare activity following an accepted Incident.</p>

              <h4>11.3.2 Eligibility and Proof</h4>
              <p>Members must:</p>
              <ul>
                <li>Provide platform-generated earning statements</li>
                <li>Demonstrate actual income loss</li>
                <li>Show the Vehicle was unfit for commercial operation due to the Incident</li>
              </ul>

              <h4>11.3.3 Calculation Method and Timeframes</h4>
              <p>The Mutual may consider:</p>
              <ul>
                <li>Average daily or weekly earnings</li>
                <li>A capped maximum number of payable days</li>
                <li>Deductions for any alternative income earned</li>
                <li>Exclusions for delays caused by the Member</li>
              </ul>
              <p><strong>Payout Limitation:</strong> Any determination of downtime benefits will be made within <strong>30 days</strong> of receipt of all required documentation, or within such other timeframe as specified in the Member Protection Schedule. The maximum payable period is limited to <strong>30 days</strong> unless otherwise stated in the Member Protection Schedule.</p>

              <h4>11.3.4 Exclusions Specific to Downtime Cover</h4>
              <p>No benefits will generally be considered for:</p>
              <ul>
                <li>Platform deactivation unrelated to vehicle condition</li>
                <li>Illness, personal leave, or scheduling gaps</li>
                <li>Pre-existing mechanical issues</li>
                <li>Insufficient documentation</li>
                <li>Unreasonable refusal of recommended repairer</li>
              </ul>
            </section>

            <section id="section-12">
              <h2>Section 12 — Claims Lodgement Requirements</h2>

              <h3>12.1 Notification Timeframes</h3>
              <p>Members must notify the Mutual of any Incident as soon as practicable and no later than 30 days after the Incident occurs. Late notification may lead to:</p>
              <ul>
                <li>Additional Excess charges</li>
                <li>Reduced consideration</li>
                <li>Declination of the claim</li>
              </ul>

              <h3>12.2 Required Information</h3>
              <p>For a claim to be considered, the Member must submit:</p>
              <ul>
                <li>A full description of how the Incident occurred</li>
                <li>Photographs or video footage of the Incident and damage</li>
                <li>Third-party details (name, contact, registration) where relevant</li>
                <li>Police event number where required</li>
                <li>Dashcam footage (if available)</li>
                <li>Platform trip logs for rideshare-related Incidents</li>
                <li>Licence and registration documentation</li>
                <li>Any additional information reasonably requested by the Mutual</li>
              </ul>

              <h3>12.3 Member Cooperation</h3>
              <p>The Member must:</p>
              <ul>
                <li>Assist with investigation and assessment of the Incident</li>
                <li>Authorise access to platform records, telematics, and location data</li>
                <li>Provide truthful and accurate statements</li>
                <li>Allow inspection of the Vehicle, including dismantling if required</li>
                <li>Attend interviews or provide declarations when requested</li>
              </ul>
              <p>Failure to cooperate may result in refusal to consider the claim.</p>

              <h3>12.4 Prohibited Actions</h3>
              <p>The Member must not:</p>
              <ul>
                <li>Admit liability</li>
                <li>Negotiate with third parties</li>
                <li>Instruct or initiate repairs without approval</li>
                <li>Dispose of damaged parts or evidence</li>
                <li>Agree to settlements with any third party</li>
              </ul>
              <p>Such actions may prejudice the Mutual's consideration of the claim.</p>

              <h3>12.5 Evidence Preservation</h3>
              <p>The Member must take reasonable steps to preserve:</p>
              <ul>
                <li>Dashcam recordings</li>
                <li>Photographs</li>
                <li>Damaged parts</li>
                <li>Repair invoices and estimates</li>
                <li>All communications relevant to the Incident</li>
              </ul>

              <h3>12.6 Fraudulent or Misleading Claims</h3>
              <p>Any claim involving dishonesty, exaggeration, false documentation, or manipulation may result in:</p>
              <ul>
                <li>Refusal to consider the claim</li>
                <li>Termination of Membership</li>
                <li>Recovery of any benefits already granted</li>
                <li>Reporting to authorities</li>
              </ul>

              <h3>12.7 Consequences of Non-Compliance</h3>
              <p>Where the Member fails to comply with lodgement requirements, the Mutual may:</p>
              <ul>
                <li>Request additional information</li>
                <li>Delay consideration</li>
                <li>Reduce any benefits</li>
                <li>Refuse to consider the claim entirely</li>
              </ul>
            </section>

            <section id="section-13">
              <h2>Section 13 — Claims Settlement (Discretionary Framework)</h2>

              <h3>13.1 Overview</h3>
              <p>The Mutual operates a discretionary claims settlement framework. All settlements are subject to the Board's absolute discretion and are guided by fairness, sustainability, and protection of the Mutual pool.</p>

              <div className={styles.important}>
                <h4>Important: The Mutual Does Not Operate Repair Facilities</h4>
                <p>The Mutual does not own, operate, or manage any vehicle repair facilities. The Mutual does not direct, supervise, or control the repair of Member vehicles. The Mutual does not accept any responsibility or liability for:</p>
                <ul>
                  <li>The quality of repairs or workmanship performed on any vehicle</li>
                  <li>The duration or timeliness of repairs</li>
                  <li>The selection or performance of any repairer, whether recommended or otherwise</li>
                  <li>Any defects, faults, or failures arising from repairs</li>
                  <li>Any consequential loss arising from repair delays or quality issues</li>
                </ul>
                <p>Members are responsible for selecting their own repairers and for satisfying themselves as to the quality and appropriateness of any repair work. Any recommendation of a repairer by the Mutual or Manager is for convenience only and does not constitute a warranty or endorsement.</p>
              </div>

              <h3>13.2 Settlement Method</h3>
              <p>The Mutual will determine the appropriate method of settlement, which may include:</p>
              <ul>
                <li>Payment towards repair of the Vehicle</li>
                <li>Payment towards replacement of parts</li>
                <li>Total Loss consideration based on Agreed Value</li>
                <li>Cash settlement (at the Mutual's discretion only)</li>
                <li>Partial payment or conditional payment</li>
                <li>No payment</li>
              </ul>
              <p>Members cannot demand a particular repairer, assessor, or settlement type.</p>

              <h3>13.3 Devaluation-Based Settlement</h3>
              <p>Where the Mutual exercises its discretion to provide a cash settlement or payment towards repairs, the amount may be determined by reference to the <strong>reasonable devaluation</strong> incurred on the Member's Vehicle as a result of the Incident.</p>
              <p>The Mutual may assess devaluation by considering:</p>
              <ul>
                <li>The pre-Incident condition and value of the Vehicle</li>
                <li>The nature and extent of the damage</li>
                <li>The post-Incident diminished value of the Vehicle</li>
                <li>Repair costs relative to the Vehicle's Agreed Value</li>
                <li>Age, mileage, and general condition of the Vehicle</li>
                <li>Any pre-existing damage or wear</li>
              </ul>
              <p>This devaluation-based approach ensures that the Mutual's discretionary payment reflects the actual financial loss suffered by the Member, rather than simply the cost of repairs which may exceed the economic value of the Vehicle.</p>

              <h3>13.4 Expert Valuation</h3>
              <p>To determine the appropriate settlement amount, the Mutual may retain qualified experts including:</p>
              <ul>
                <li>Independent vehicle assessors</li>
                <li>Certified automotive valuers</li>
                <li>Mechanical engineers</li>
                <li>Forensic investigators where fraud is suspected</li>
              </ul>
              <p>The cost of expert assessment retained by the Mutual will be borne by the Mutual.</p>
              <p>Members may, at their own expense, engage independent experts to provide alternative valuations or assessments. The Mutual will consider any such independent expert reports provided by the Member, however the Board retains absolute discretion in determining the final settlement amount.</p>

              <h3>13.5 Cash Settlements</h3>
              <p>Cash settlements are provided only at the Mutual's discretion. The cash settlement amount may be <strong>less than</strong> the estimated or actual repair costs where:</p>
              <ul>
                <li>The devaluation incurred is less than the repair cost</li>
                <li>Salvage value must be deducted</li>
                <li>The Vehicle's condition, age, or depreciation is considered</li>
                <li>Pre-existing damage or wear is identified</li>
                <li>Uncertainty exists regarding the full extent of damage</li>
                <li>Repair costs exceed a reasonable proportion of the Agreed Value</li>
              </ul>

              <div className={styles.example}>
                <h4>Example: Cash Settlement Less Than Repair Costs</h4>
                <p><strong>Scenario:</strong> A Member's Vehicle with an Agreed Value of $15,000 sustains front-end damage. A repairer quotes $8,000 for repairs.</p>
                <p><strong>Assessment:</strong> The Mutual's assessor determines that:</p>
                <ul>
                  <li>The Vehicle had pre-existing minor damage (undeclared scratches, worn tyres) reducing its pre-Incident value</li>
                  <li>The actual devaluation caused by the Incident is assessed at $5,500</li>
                  <li>Some quoted repairs address pre-existing wear rather than Incident damage</li>
                </ul>
                <p><strong>Outcome:</strong> The Mutual exercises discretion to offer a cash settlement of $5,500, reflecting the assessed devaluation rather than the full $8,000 repair quote. The Member may choose to:</p>
                <ul>
                  <li>Accept the cash settlement and arrange their own repairs</li>
                  <li>Accept the settlement and not repair the Vehicle</li>
                  <li>Provide additional evidence or an independent assessment for the Board's consideration</li>
                </ul>
              </div>

              <h3>13.6 Total Loss Determination</h3>
              <p>A Vehicle may be declared a Total Loss where:</p>
              <ul>
                <li>Repairs exceed a percentage of the Agreed Value (as set by the Mutual)</li>
                <li>Structural integrity is compromised</li>
                <li>Repair is uneconomical</li>
                <li>Member refuses recommended repair arrangements</li>
              </ul>
              <p>Upon Total Loss determination, the Mutual may consider payment up to the Agreed Value as recorded in the Member Protection Schedule. Salvage rights may transfer to the Mutual.</p>

              <h3>13.7 Subrogation and Recoveries</h3>
              <p>The Mutual may pursue recovery against third parties. Members must not:</p>
              <ul>
                <li>Compromise recovery rights</li>
                <li>Sign agreements with other parties</li>
                <li>Accept liability without approval</li>
              </ul>
              <p>The Mutual may take over conduct of negotiations or legal proceedings.</p>

              <h3>13.8 Fraud or Dishonesty</h3>
              <p>Any fraud, false documentation, exaggeration, or deception may result in:</p>
              <ul>
                <li>Declination of the claim</li>
                <li>Termination of Membership</li>
                <li>Recovery of any amounts granted</li>
                <li>Referral to authorities</li>
              </ul>

              <h3>13.9 Member Conduct Affecting Settlement</h3>
              <p>Settlement may be reduced or declined where a Member:</p>
              <ul>
                <li>Fails to maintain roadworthiness</li>
                <li>Fails to disclose relevant information</li>
                <li>Contributes to increased loss or delay</li>
                <li>Impedes assessment or inspection</li>
              </ul>

              <h3>13.10 No Appeal Rights to Payment Amounts</h3>
              <p>Members may request internal review, but cannot compel the Mutual or AFCA to pay benefits.</p>
            </section>

            <section id="section-14">
              <h2>Section 14 — Exclusions</h2>

              <h3>14.1 Overview</h3>
              <p>The following exclusions guide the Mutual's discretionary decision-making. These exclusions do not limit the Board's ability to decline a claim for other reasons related to Member conduct, equity, or financial protection of the Mutual.</p>

              <h3>14.2 Driver-Related Exclusions</h3>
              <p>The Mutual will generally not consider claims where the Vehicle was driven by:</p>
              <ul>
                <li>A person without a valid licence</li>
                <li>A driver whose licence was suspended or cancelled</li>
                <li>A person impaired by drugs or alcohol</li>
                <li>A driver under the legal driving age</li>
                <li>An undeclared driver, unless optional cover applies</li>
                <li>A driver acting recklessly or dangerously</li>
              </ul>

              <h3>14.3 Vehicle Use Exclusions</h3>
              <p>Claims may not be considered where the Vehicle was being used for:</p>
              <ul>
                <li>Illegal activities or criminal acts</li>
                <li>Racing, time trials, or high-speed events</li>
                <li>Off-road driving where not intended or declared</li>
                <li>Delivery, courier, rideshare, or hire use not disclosed to the Mutual</li>
                <li>Towing loads beyond manufacturer limits</li>
                <li>Use inconsistent with Member declarations or the Constitution</li>
              </ul>

              <h3>14.4 Vehicle Condition Exclusions</h3>
              <p>The Mutual may refuse to consider claims involving Vehicles that were:</p>
              <ul>
                <li>Unroadworthy or unregistered</li>
                <li>Mechanically unsound due to poor maintenance</li>
                <li>Damaged prior to the Incident (pre-existing damage)</li>
                <li>Fitted with unsafe, unapproved, or undeclared modifications</li>
              </ul>

              <h3>14.5 Incident Exclusions</h3>
              <p>The Mutual will generally not consider claims involving:</p>
              <ul>
                <li>Wear and tear or mechanical breakdown</li>
                <li>Gradual deterioration, corrosion, rust, or mould</li>
                <li>Water ingress not caused by a sudden event</li>
                <li>Tyre damage from punctures or road hazards unless other damage occurred</li>
                <li>Loss or damage from poor or incomplete repairs</li>
                <li>Damage during commercial operations not declared by the Member</li>
              </ul>

              <h3>14.6 Criminal, Fraudulent, or Intentional Acts</h3>
              <p>No benefits will be considered where:</p>
              <ul>
                <li>The Member or driver intentionally caused the damage</li>
                <li>Fraudulent documents or statements are provided</li>
                <li>The Incident occurred during unlawful or criminal behaviour</li>
                <li>The Member attempted to mislead or deceive the Mutual</li>
              </ul>

              <h3>14.7 Environmental and Maintenance-Related Exclusions</h3>
              <p>Claims may be declined for:</p>
              <ul>
                <li>Damage caused by rodents, insects, or animals owned by the Member</li>
                <li>Failure to maintain tyres, brakes, suspension, and critical systems</li>
                <li>Operating the Vehicle in a knowingly unsafe condition</li>
              </ul>

              <h3>14.8 Consequences of Excluded Events</h3>
              <p>Where an excluded event applies, the Mutual may:</p>
              <ul>
                <li>Decline to consider the claim entirely</li>
                <li>Reduce any benefit</li>
                <li>Impose additional Excesses</li>
                <li>Suspend or terminate Membership</li>
              </ul>
            </section>

            <section id="section-15">
              <h2>Section 15 — Excess Structure</h2>

              <h3>15.1 Overview</h3>
              <p>An Excess is the amount the Member must pay before the Mutual will consider a claim. The Excess applies to every Incident unless otherwise specified. Non-payment of the Excess may result in the Mutual refusing to consider the claim.</p>

              <h3>15.2 Types of Excess</h3>

              <h4>15.2.1 Basic Excess</h4>
              <p>A Basic Excess applies to most Incidents. The amount is specified in the Member Protection Schedule and may vary based on risk factors including Vehicle type and usage.</p>

              <h4>15.2.2 Age or Inexperienced Driver Excess</h4>
              <p>An additional Excess may apply where the driver:</p>
              <ul>
                <li>Is under 25 years of age</li>
                <li>Has held a licence for less than 2 years</li>
              </ul>
              <p>This Excess is cumulative with the Basic Excess.</p>

              <h4>15.2.3 Undeclared Driver Excess</h4>
              <p>If the driver at the time of the Incident was not declared to the Mutual as a regular or permitted driver, an additional Excess may apply or the claim may be refused.</p>

              <h4>15.2.4 Late Lodgement Excess</h4>
              <p>Where a Member lodges a claim outside the required 30-day notification period, a Late Lodgement Excess may apply. This reflects increased risk of fraud, evidentiary gaps, or compromised assessment.</p>

              <h4>15.2.5 Add-On Cover Excess</h4>
              <p>Certain Optional Add-On Covers, including Downtime / Loss of Income, may carry their own additional Excess amounts. These are stated in the Optional Cover Schedule.</p>

              <h3>15.3 Payment of Excess</h3>
              <p>The Excess must be paid:</p>
              <ul>
                <li>Before the Mutual considers a claim; or</li>
                <li>Deducted from any discretionary payment, where permitted.</li>
              </ul>

              <h3>15.4 Non-Payment of Excess</h3>
              <p>If the Member refuses or fails to pay any applicable Excess:</p>
              <ul>
                <li>The Mutual may decline to consider the claim</li>
                <li>The claim may be delayed indefinitely</li>
                <li>Membership may be suspended until payment is made</li>
              </ul>

              <h3>15.5 Multiple Excesses</h3>
              <p>Multiple Excesses may apply concurrently. These include but are not limited to:</p>
              <ul>
                <li>Basic Excess</li>
                <li>Age Excess</li>
                <li>Undeclared Driver Excess</li>
                <li>Late Lodgement Excess</li>
                <li>Add-On Excess</li>
              </ul>

              <h3>15.6 Discretion to Waive Excess</h3>
              <p>The Board may waive, reduce, or alter an Excess at its absolute discretion. This does not create any precedent or entitlement for future claims.</p>
            </section>

            <section id="section-16">
              <h2>Section 16 — Complaints & Dispute Resolution (IDR & AFCA)</h2>

              <h3>16.1 Overview</h3>
              <p>The Product Issuer and the AFSL holder are committed to fair, efficient, and transparent handling of complaints. All complaints are managed in accordance with the Corporations Act 2001 (Cth), ASIC Regulatory Guide 271 (Internal Dispute Resolution), and the Mutual's internal policies.</p>

              <h3>16.2 What You May Complain About</h3>
              <p>Members may lodge complaints regarding:</p>
              <ul>
                <li>Conduct of the Mutual or Manager</li>
                <li>Claims handling process</li>
                <li>Communication or service quality</li>
                <li>Delays or administrative errors</li>
                <li>Behaviour inconsistent with this PDS or the Mutual's Constitution</li>
              </ul>

              <h3>16.3 Internal Dispute Resolution (IDR)</h3>
              <p>Complaints should first be submitted to the Mutual Manager. The Manager will:</p>
              <ul>
                <li>Acknowledge the complaint promptly</li>
                <li>Investigate the facts and circumstances</li>
                <li>Provide a written response within the timeframes in RG 271</li>
                <li>Outline the reasons for any decision</li>
              </ul>

              <h3>16.4 If You Are Not Satisfied — AFCA</h3>
              <p>If the Member is dissatisfied with the IDR outcome, the Member may escalate the matter to the Australian Financial Complaints Authority (AFCA).</p>
              <p>AFCA can review:</p>
              <ul>
                <li>Conduct of the AFSL holder (AMIR)</li>
                <li>Service and administrative issues</li>
                <li>Delays or unfair treatment</li>
              </ul>
              <p>AFCA cannot compel the Mutual to pay a claim due to the discretionary nature of the product.</p>

              <h3>16.5 Information Required for AFCA Complaints</h3>
              <p>AFCA may require:</p>
              <ul>
                <li>A copy of the Member's complaint</li>
                <li>Evidence submitted to the Mutual</li>
                <li>The IDR response</li>
                <li>Supporting documentation, receipts, or statements</li>
              </ul>

              <h3>16.6 AFCA's Role</h3>
              <p>AFCA's determination is binding on the AFSL holder, but not the Mutual, in relation to whether a claim should be paid.</p>

              <h3>16.7 Escalation to the Board (Internal Review)</h3>
              <p>Members may request an internal review by the Board. The Board may:</p>
              <ul>
                <li>Uphold the original decision</li>
                <li>Modify the decision</li>
                <li>Decline to review the decision</li>
              </ul>
              <p>The Board is under no obligation to provide reasons beyond those already stated.</p>

              <h3>16.8 No Automatic Right to Appeal</h3>
              <p>Members have no contractual right to appeal discretionary determinations. Complaints processes provide fairness but do not guarantee a change in outcome.</p>
            </section>

            <section id="section-17">
              <h2>Section 17 — Definitions</h2>

              <p>The following terms are used throughout this Product Disclosure Statement, Financial Services Guide, and associated Schedules. These definitions apply unless the context requires otherwise.</p>

              <h3>17.1 Accident</h3>
              <p>A sudden, unexpected, and unintended event causing damage or loss. Does not include mechanical failure, gradual deterioration, or wear and tear.</p>

              <h3>17.2 Accident Management Partner (AMP)</h3>
              <p>A service provider that may assist with repair coordination, assessment, recovery, logistics, and related operational functions. Use of an AMP is optional and any recommendation does not constitute a warranty or endorsement by the Mutual.</p>

              <h3>17.3 Add-On Cover</h3>
              <p>Optional discretionary protection available for an additional Contribution, including Overseas Licence Holder Cover and Rideshare Downtime / Loss of Income Cover.</p>

              <h3>17.4 AFCA</h3>
              <p>The Australian Financial Complaints Authority, the external dispute resolution body established under Part 7.10A of the Corporations Act 2001 (Cth).</p>

              <h3>17.5 AFSL Holder</h3>
              <p>ASIA MIDEAST INSURANCE AND REINSURANCE PTY LTD (AMIR), AFSL 239 926, which authorises National Cover Pty Ltd to provide financial services to Members.</p>

              <h3>17.6 Agreed Value</h3>
              <p>The value of the Vehicle as recorded in the Member Protection Schedule at the time of joining or renewal. The Agreed Value represents the maximum amount the Mutual may consider paying in the event of a Total Loss and is determined based on information provided by the Member.</p>

              <h3>17.7 Board</h3>
              <p>The Board of Directors of Motor Cover Mutual Ltd, responsible for the governance, oversight, and discretionary decision-making of the Mutual.</p>

              <h3>17.8 Claim</h3>
              <p>A request by a Member seeking discretionary consideration of benefits in relation to an Incident.</p>

              <h3>17.9 Contribution</h3>
              <p>The amount paid by a Member as the cost of participation in the Mutual's protection pool for a specified Protection Period.</p>

              <h3>17.10 CTP Insurance (Compulsory Third Party Insurance)</h3>
              <p>Compulsory insurance required by law in all Australian states and territories that covers personal injury to people involved in motor vehicle accidents. CTP insurance is not provided by the Mutual and must be obtained separately by Members, typically as part of vehicle registration.</p>

              <h3>17.11 Devaluation</h3>
              <p>The reduction in the value of a Vehicle as a result of an Incident, used by the Mutual as a measure in determining discretionary cash settlement amounts.</p>

              <h3>17.12 Discretion</h3>
              <p>The Mutual's unrestricted right to approve, reduce, condition, delay, or decline benefits for any claim, regardless of whether it appears to fall within protection guidelines.</p>

              <h3>17.13 Excess</h3>
              <p>The amount payable by the Member before the Mutual will consider a claim.</p>

              <h3>17.14 Incident</h3>
              <p>An event or occurrence that results in damage, loss, or liability for which a Member seeks consideration.</p>

              <h3>17.15 Member</h3>
              <p>A person or entity accepted as a Member of the Mutual upon approval of an application and payment of required Contributions.</p>

              <h3>17.16 Membership</h3>
              <p>The status of being a Member of the Mutual and being eligible for discretionary protection subject to compliance with obligations.</p>

              <h3>17.17 Member Protection Schedule</h3>
              <p>A schedule issued to each Member specifying the Agreed Value, applicable limits, Excesses, protection details, and Add-On Covers.</p>

              <h3>17.18 Mutual</h3>
              <p>Motor Cover Mutual Ltd.</p>

              <h3>17.19 Optional Cover Schedule</h3>
              <p>A schedule that outlines details, limits, Excesses, and conditions of Add-On Covers purchased by the Member.</p>

              <h3>17.20 Own Damage Protection</h3>
              <p>Discretionary protection for damage to the Member's own Vehicle. Does not include damage to third-party property, other vehicles, or personal injury to third parties.</p>

              <h3>17.21 Protection Period</h3>
              <p>The time period for which Contributions have been paid and during which discretionary protection may be considered.</p>

              <h3>17.22 Rideshare</h3>
              <p>Use of the Vehicle to transport passengers for hire or reward through a digital platform, including Uber, DiDi, Ola, Shebah, and similar services.</p>

              <h3>17.23 Third Party Property Damage (TPPD) Insurance</h3>
              <p>Insurance obtained by the Mutual from an APRA-authorised insurer to cover damage caused by a Member's Vehicle to other people's vehicles and property. TPPD Insurance is not underwritten by the Mutual.</p>

              <h3>17.24 Total Loss</h3>
              <p>A determination made by the Mutual that the cost of repair is uneconomical or unsafe, or that repair would exceed a percentage of the Vehicle's Agreed Value.</p>

              <h3>17.25 Vehicle</h3>
              <p>The car, van, utility, or other motor vehicle identified in the Member Protection Schedule.</p>
            </section>

            <section id="section-18">
              <h2>Section 18 — Glossary of Statutory References</h2>

              <p>This Glossary summarises key Australian legislation and regulatory instruments relevant to the operation of Motor Cover Mutual Ltd and the provision of discretionary protection.</p>

              <h3>18.1 Corporations Act 2001 (Cth)</h3>
              <p>The primary statute governing financial services, financial products, licensing, disclosure obligations, and conduct requirements. Discretionary mutual products fall under Chapter 7 as "miscellaneous financial risk products".</p>

              <h3>18.2 ASIC Act 2001 (Cth)</h3>
              <p>Establishes the Australian Securities and Investments Commission (ASIC) and sets out consumer protection provisions applicable to financial services, including prohibitions on misleading or deceptive conduct.</p>

              <h3>18.3 Insurance Contracts Act 1984 (Cth) (ICA)</h3>
              <p>Does not apply to discretionary mutuals, as there is no contract of insurance nor a binding promise of indemnity (s9). Accordingly, ICA remedies, obligations, and protections do not extend to Members.</p>

              <h3>18.4 Privacy Act 1988 (Cth)</h3>
              <p>Regulates the handling, storage, and disclosure of personal information. The Mutual Manager must comply with the Australian Privacy Principles (APPs) when collecting Member information.</p>

              <h3>18.5 ASIC Regulatory Guide 146 (RG 146)</h3>
              <p>Sets minimum training standards for providing financial product advice. Representatives of the AFSL holder must be trained and competent in accordance with this Guide.</p>

              <h3>18.6 ASIC Regulatory Guide 168 (RG 168)</h3>
              <p>Provides guidance on disclosure obligations, including Product Disclosure Statements (PDS). This PDS is prepared in accordance with the Guide's principles for clear, balanced disclosure.</p>

              <h3>18.7 ASIC Regulatory Guide 271 (RG 271)</h3>
              <p>Sets mandatory standards for Internal Dispute Resolution (IDR), including timeframes, record keeping, and response obligations. The Mutual Manager's complaints process complies with this Guide.</p>

              <h3>18.8 AFCA Rules</h3>
              <p>The rules of the Australian Financial Complaints Authority govern:</p>
              <ul>
                <li>How complaints can be made</li>
                <li>When AFCA has jurisdiction</li>
                <li>Binding outcomes against AFSL holders</li>
                <li>Limits on AFCA's power regarding discretionary mutuals</li>
              </ul>

              <h3>18.9 Australian Consumer Law (ACL)</h3>
              <p>Contained in Schedule 2 to the Competition and Consumer Act 2010 (Cth). Prohibits unfair contract terms, misleading or deceptive conduct, and sets consumer guarantees.</p>

              <h3>18.10 Mutual's Constitution</h3>
              <p>The governing document of Motor Cover Mutual Ltd, establishing:</p>
              <ul>
                <li>Membership rules</li>
                <li>Powers of the Board</li>
                <li>Discretionary authority</li>
                <li>Contribution and termination rules</li>
                <li>Governance and voting</li>
              </ul>

              <h3>18.11 Protection Guidelines</h3>
              <p>Internal guidelines used by the Board when exercising its discretion. These guidelines inform but do not bind the Board's decision-making.</p>
            </section>

            <section id="section-19">
              <h2>Section 19 — Add-On Cover Schedules</h2>

              <div className={styles.schedule}>
                <h3>Schedule A — Overseas Licence Holder Add-On Cover</h3>

                <h4>A1. Purpose</h4>
                <p>This Schedule sets out the terms under which the Mutual may consider claims involving drivers who hold overseas licences.</p>

                <h4>A2. Eligibility</h4>
                <ul>
                  <li>The driver must hold a valid overseas licence that is legally recognised in the relevant Australian jurisdiction.</li>
                  <li>The driver must be declared to the Mutual prior to any Incident.</li>
                  <li>Translations or certified copies may be required.</li>
                </ul>

                <h4>A3. Evidence Requirements</h4>
                <p>Members must provide:</p>
                <ul>
                  <li>A copy of the overseas licence</li>
                  <li>A certified translation (if required)</li>
                  <li>Proof of licence validity in Australia</li>
                  <li>Driving history or declarations where requested</li>
                </ul>

                <h4>A4. Discretionary Limits</h4>
                <p>The Mutual may decline claims where:</p>
                <ul>
                  <li>The licence is invalid or expired</li>
                  <li>The driver breached road laws</li>
                  <li>Verification cannot be completed</li>
                  <li>There is evidence of elevated risk</li>
                </ul>

                <h4>A5. Exclusions</h4>
                <p>No benefits will generally be considered where:</p>
                <ul>
                  <li>The driver was unlicensed or improperly licensed</li>
                  <li>The licence was forged, altered, or misleading</li>
                  <li>The driver was operating commercially without required platform approvals</li>
                </ul>
              </div>

              <div className={styles.schedule}>
                <h3>Schedule B — Rideshare Downtime / Loss of Income Add-On Cover</h3>

                <h4>B1. Purpose</h4>
                <p>This Add-On may provide discretionary consideration for economic loss suffered when the Vehicle cannot be used for authorised rideshare activities following an accepted Incident.</p>

                <h4>B2. Eligibility</h4>
                <ul>
                  <li>The Member must have active rideshare platform accounts.</li>
                  <li>The Vehicle must have been roadworthy and approved for commercial use at the time of the Incident.</li>
                  <li>Downtime must result directly from the covered Incident.</li>
                </ul>

                <h4>B3. Evidence Requirements</h4>
                <p>Members must provide:</p>
                <ul>
                  <li>Platform earnings statements for the 4–8 weeks prior to the Incident</li>
                  <li>Daily or weekly trip logs</li>
                  <li>Confirmation of deactivation due to vehicle unavailability</li>
                  <li>Repair timelines and invoices</li>
                  <li>Any income earned during the downtime period</li>
                </ul>

                <h4>B4. Calculation of Benefits</h4>
                <p>The Mutual may consider:</p>
                <ul>
                  <li>Average daily earnings</li>
                  <li>Maximum payable days (as shown in Member Protection Schedule)</li>
                  <li>Reasonable deductions for alternative income</li>
                  <li>Pro-rating for partial downtime</li>
                </ul>

                <h4>B5. Payout Timeframe</h4>
                <p>Determination of any downtime benefits will be made within <strong>30 days</strong> of receipt of all required documentation, or within such other timeframe as specified in the Member Protection Schedule.</p>

                <h4>B6. Exclusions</h4>
                <p>No benefits will generally be considered where downtime was caused by:</p>
                <ul>
                  <li>Platform suspension unrelated to the Vehicle</li>
                  <li>Personal illness or unavailability</li>
                  <li>Pre-existing mechanical issues</li>
                  <li>Delays caused by the Member (missed repair bookings, non-cooperation)</li>
                  <li>Failure to use the recommended repair network</li>
                </ul>

                <h4>B7. Limits</h4>
                <p>The maximum benefit is limited to <strong>30 days</strong> unless otherwise specified in the Member Protection Schedule, and remains at the full discretion of the Mutual.</p>
              </div>
            </section>

            <section id="section-20">
              <h2>Section 20 — Detailed Member Obligations</h2>

              <h3>20.1 Overview</h3>
              <p>Membership of Motor Cover Mutual Ltd requires adherence to a range of obligations designed to protect the integrity of the Mutual, ensure fairness to all Members, and assist the Board in exercising its discretion responsibly.</p>

              <h3>20.2 Duty to Provide Accurate Information</h3>
              <p>Members must provide complete and accurate information when:</p>
              <ul>
                <li>Applying for Membership</li>
                <li>Renewing protection</li>
                <li>Updating driver or vehicle details</li>
                <li>Lodging a claim</li>
                <li>Responding to Mutual enquiries</li>
              </ul>
              <p>Providing misleading, incorrect, or incomplete information may result in refusal to consider claims, suspension, or termination.</p>

              <h3>20.3 Ongoing Disclosure Obligations</h3>
              <p>Members must immediately notify the Mutual of:</p>
              <ul>
                <li>New regular or occasional drivers</li>
                <li>Overseas-licensed drivers</li>
                <li>Changes in rideshare or commercial usage</li>
                <li>Modifications or mechanical defects</li>
                <li>Loss of licence or endorsements</li>
                <li>Changes affecting the Vehicle's roadworthiness</li>
                <li>Changes to registration status</li>
              </ul>

              <h3>20.4 Vehicle Condition Requirements</h3>
              <p>The Vehicle must be:</p>
              <ul>
                <li>Roadworthy</li>
                <li>Registered</li>
                <li>Properly maintained</li>
                <li>Suitable for any declared commercial use</li>
              </ul>
              <p>Members must address mechanical warnings, unsafe conditions, and overdue servicing promptly.</p>

              <h3>20.5 Cooperation in Assessments</h3>
              <p>The Member must:</p>
              <ul>
                <li>Provide all requested documents</li>
                <li>Make the Vehicle available for inspection</li>
                <li>Authorise dismantling if needed for assessment</li>
                <li>Supply dashcam footage, photographs, and statements</li>
                <li>Allow access to platform logs (Uber, Ola, DiDi, etc.)</li>
                <li>Comply with directions to attend interviews or provide declarations</li>
              </ul>
              <p>Failure to cooperate may lead to delays, reductions, or refusal of claim consideration.</p>

              <h3>20.6 Repair Obligations</h3>
              <p>Members must:</p>
              <ul>
                <li>Not authorise repairs without written approval from the Mutual</li>
                <li>Not interfere with assessment processes</li>
                <li>Not dispose of parts or evidence</li>
                <li>Follow repair timelines and appointments</li>
              </ul>
              <p>Note: The Mutual does not direct repairs or accept liability for repair quality. Members are responsible for selecting repairers and ensuring satisfactory workmanship.</p>

              <h3>20.7 Behaviour and Conduct</h3>
              <p>Members must not:</p>
              <ul>
                <li>Act in a threatening or abusive manner</li>
                <li>Attempt to deceive or influence assessors</li>
                <li>Collude with repairers or third parties</li>
                <li>Interfere with recovery rights or negotiations</li>
              </ul>

              <h3>20.8 Financial Obligations</h3>
              <p>Members must:</p>
              <ul>
                <li>Pay Contributions by the due date</li>
                <li>Pay all applicable Excesses</li>
                <li>Pay any additional charges specified in the Protection Schedule</li>
              </ul>
              <p>Unpaid amounts may result in suspension.</p>

              <h3>20.9 Suspension Consequences</h3>
              <p>During suspension:</p>
              <ul>
                <li>No new claims may be submitted</li>
                <li>Existing claims will not be considered</li>
                <li>Add-On Covers are inactive</li>
              </ul>

              <h3>20.10 Termination of Membership</h3>
              <p>Membership may be terminated for:</p>
              <ul>
                <li>Fraud or attempted fraud</li>
                <li>Non-compliance with obligations</li>
                <li>Conduct damaging to the Mutual</li>
                <li>Repeated breaches</li>
                <li>Non-payment</li>
              </ul>
              <p>Termination does not create any entitlement to refunds unless explicitly approved by the Board.</p>

              <h3>20.11 Reinstatement</h3>
              <p>Reinstatement is at the Board's absolute discretion and may require:</p>
              <ul>
                <li>Payment of overdue amounts</li>
                <li>New declarations</li>
                <li>Updated documentation</li>
                <li>Additional Excesses or restrictions</li>
              </ul>
              <p>There is no right to reinstatement.</p>
            </section>

            <section id="section-21">
              <h2>Section 21 — Example Scenarios</h2>

              <h3>21.1 Purpose of Examples</h3>
              <p>The following examples illustrate how the Mutual may exercise discretion. These examples are illustrative only and do not create any entitlement to benefits.</p>

              <hr />

              <h3>21.2 Example — Accepted Claims (Typical Scenarios)</h3>

              <div className={styles.example}>
                <h4>Example 1 — Not-At-Fault Collision (Third Party Claim Assistance)</h4>
                <p>The Member is rear-ended at a traffic light by another driver. Evidence provided:</p>
                <ul>
                  <li>Photos of damage</li>
                  <li>Third-party details</li>
                  <li>Dashcam footage</li>
                  <li>Prompt notification</li>
                </ul>
                <p>The Mutual may assist the Member by:</p>
                <ul>
                  <li>Obtaining insurance details for the at-fault party</li>
                  <li>Engaging an Accident Management Partner (AMP) on the Member's behalf</li>
                  <li>Facilitating a claim against the other party's insurance for the cost of repairs</li>
                </ul>
                <p>This assistance helps the Member recover costs without necessarily requiring a claim against the Mutual's Own Damage Protection.</p>
              </div>

              <div className={styles.example}>
                <h4>Example 2 — Single Vehicle Incident (Cash Settlement)</h4>
                <p>The Member's Vehicle is damaged in an accepted Incident where no other party is involved, such as:</p>
                <ul>
                  <li>A single vehicle collision (e.g., hitting a pole or barrier)</li>
                  <li>Storm damage (hail, fallen tree branch)</li>
                  <li>Flood damage</li>
                  <li>Vandalism or malicious damage</li>
                </ul>
                <p>The Mutual assesses the damage and determines the reasonable devaluation caused to the Vehicle. The Mutual exercises its discretion to provide a cash settlement representing this devaluation amount, allowing the Member to arrange repairs or apply the funds as they see fit.</p>
              </div>

              <div className={styles.example}>
                <h4>Example 3 — Rideshare Downtime (Loss of Income)</h4>
                <p>An accepted Incident has occurred and the Member's Vehicle is undriveable, leaving the Member without a car for rideshare work. The Member has purchased the Rideshare Downtime / Loss of Income Add-On Cover as part of their Member Protection Schedule.</p>
                <p>The Mutual may consider making a payment for loss of income:</p>
                <ul>
                  <li>Subject to the Member providing platform earnings statements and evidence of downtime</li>
                  <li>Up to the limit specified in the Member Protection Schedule</li>
                  <li>For a maximum of 30 days or as otherwise stated in the Schedule</li>
                </ul>
              </div>

              <hr />

              <h3>21.3 Example — Reduced Payments</h3>

              <div className={styles.exampleWarning}>
                <h4>Example 4 — Late Lodgement</h4>
                <p>Incident reported 60 days late with weak evidence. The Mutual may:</p>
                <ul>
                  <li>Apply Late Lodgement Excess</li>
                  <li>Reduce or decline the claim</li>
                </ul>
              </div>

              <div className={styles.exampleWarning}>
                <h4>Example 5 — Contributory Misconduct</h4>
                <p>Member drove on bald tyres. Damage worsened due to poor maintenance. The Mutual may reduce benefits.</p>
              </div>

              <div className={styles.exampleWarning}>
                <h4>Example 6 — Partial Evidence</h4>
                <p>Member cannot provide third-party details or photos. The Mutual may reduce benefits or require more evidence.</p>
              </div>

              <div className={styles.exampleWarning}>
                <h4>Example 7 — Cash Settlement Below Repair Cost</h4>
                <p>Member's Vehicle sustains $8,000 in quoted repairs but assessment reveals pre-existing damage and wear. Devaluation assessed at $5,500. The Mutual offers cash settlement of $5,500 rather than the full repair quote.</p>
              </div>

              <hr />

              <h3>21.4 Example — Declined Claims</h3>

              <div className={styles.exampleError}>
                <h4>Example 8 — Mechanical Breakdown</h4>
                <p>Vehicle suffers engine failure with no collision. No accidental cause. Claim will likely not be considered.</p>
              </div>

              <div className={styles.exampleError}>
                <h4>Example 9 — Undeclared Driver</h4>
                <p>Driver was not disclosed to the Mutual and is younger than the minimum age specified in the Member Protection Schedule. Claim may be refused.</p>
              </div>

              <div className={styles.exampleError}>
                <h4>Example 10 — Fraudulent Dashcam Footage</h4>
                <p>Provided footage contradicts timestamps or metadata. Claim may be refused and Membership may be terminated.</p>
              </div>

              <div className={styles.exampleError}>
                <h4>Example 11 — Rideshare Downtime Deactivation (Invalid)</h4>
                <p>Vehicle damage did not cause platform deactivation. No downtime attributable to the Incident. Claim will likely be refused.</p>
              </div>

              <div className={styles.exampleError}>
                <h4>Example 12 — Unroadworthy Vehicle</h4>
                <p>Vehicle had major structural rust and unsafe brakes. The Mutual may decline to consider the claim due to roadworthiness.</p>
              </div>

              <div className={styles.exampleError}>
                <h4>Example 13 — Third-Party Damage Claim</h4>
                <p>Member causes damage to another vehicle and seeks cover for the other party's repairs. This is not covered under Own Damage Protection. Claim will be refused.</p>
              </div>

              <hr />

              <h3>21.5 Example — Total Loss Determination</h3>

              <div className={styles.example}>
                <h4>Example 14 — Severe Collision</h4>
                <p>The Member's Vehicle sustains significant damage in a collision. The Mutual's assessor determines that repair costs would be uneconomical relative to the Vehicle's Agreed Value. The Mutual may:</p>
                <ul>
                  <li>Declare the Vehicle a Total Loss</li>
                  <li>Consider payment up to the Agreed Value as recorded in the Member Protection Schedule</li>
                  <li>Take possession of the salvage</li>
                </ul>
              </div>

              <hr />

              <h3>21.6 Example — Third-Party Recovery</h3>

              <div className={styles.example}>
                <h4>Example 15 — Mutual Pursues At-Fault Driver</h4>
                <p>A Member's Vehicle is damaged by an at-fault third party. The Member lodges a claim and the Mutual exercises discretion to fund repairs to the Member's Vehicle.</p>
                <p>Subsequently:</p>
                <ul>
                  <li>The Mutual, exercising its subrogation rights, pursues recovery from the at-fault party's insurer</li>
                  <li>The third-party insurer accepts liability and reimburses the Mutual for the repair costs</li>
                  <li>The Mutual recovers the funds it paid out</li>
                </ul>
                <p><strong>Outcome:</strong> The recovered funds are retained by the Mutual to support the protection pool for all Members. This does not automatically entitle the Member to reimbursement of any Excess paid, unless the Board exercises its discretion to refund the Excess in recognition of the successful recovery.</p>
                <p>Members must cooperate with recovery efforts and must not compromise the Mutual's ability to pursue third parties by admitting liability, signing releases, or accepting settlements without the Mutual's approval.</p>
              </div>

              <hr />

              <h3>21.7 Summary</h3>
              <p>Examples help Members understand typical outcomes, but every decision remains at the full discretion of the Board.</p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PDSPage;
