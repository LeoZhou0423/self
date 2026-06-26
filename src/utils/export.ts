/** Higher scale yields sharper exports at the cost of memory. */
const EXPORT_SCALE = 3;

export async function exportElementToImage(element: HTMLElement, filename: string) {
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(element, {
    scale: EXPORT_SCALE,
    backgroundColor: getComputedStyle(element).backgroundColor || '#ffffff',
    useCORS: true,
    // Ensure text renders crisply
    logging: false,
  });

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename}.png`;
  link.click();
}

export async function shareElementImage(element: HTMLElement, filename: string) {
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(element, {
    scale: EXPORT_SCALE,
    backgroundColor: getComputedStyle(element).backgroundColor || '#ffffff',
    useCORS: true,
    logging: false,
  });

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png')
  );
  if (!blob) return;

  const file = new File([blob], `${filename}.png`, { type: 'image/png' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: '关于自己',
      text: '来看看我的结果',
    });
  } else {
    await exportElementToImage(element, filename);
  }
}

export async function exportElementToPDF(element: HTMLElement, filename: string) {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const canvas = await html2canvas(element, {
    scale: EXPORT_SCALE,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight - margin * 2;
  }

  pdf.save(`${filename}.pdf`);
}

/**
 * Export scores as a text file.
 */
export function exportDataAsText(
  scores: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    subDimensions?: Record<string, number>;
    selfEsteem?: number;
    attachmentAnxiety?: number;
    attachmentAvoidance?: number;
    depressionScore?: number;
    anxietyScore?: number;
    sleepQuality?: number;
  },
  filename: string,
) {
  const lines: string[] = [
    '═══════════════════════════════════════',
    '  你的画像',
    '═══════════════════════════════════════',
    '',
    `时间: ${new Date().toLocaleString('zh-CN')}`,
    '',
  ];

  lines.push('── 性格倾向 ──');
  lines.push(`  对外界的态度: ${scores.openness}/100`);
  lines.push(`  做事风格:     ${scores.conscientiousness}/100`);
  lines.push(`  社交倾向:     ${scores.extraversion}/100`);
  lines.push(`  待人方式:     ${scores.agreeableness}/100`);
  lines.push(`  情绪感受:     ${scores.neuroticism}/100`);
  lines.push('');

  if (scores.subDimensions && Object.keys(scores.subDimensions).length > 0) {
    lines.push('── 子维度 ──');
    for (const [key, value] of Object.entries(scores.subDimensions)) {
      lines.push(`  ${key}: ${value}/100`);
    }
    lines.push('');
  }

  if (scores.selfEsteem !== undefined) {
    lines.push(`  自我价值感: ${scores.selfEsteem}/100`);
  }
  if (scores.attachmentAnxiety !== undefined) {
    lines.push(`  关系焦虑:   ${scores.attachmentAnxiety}/100`);
  }
  if (scores.attachmentAvoidance !== undefined) {
    lines.push(`  关系回避:   ${scores.attachmentAvoidance}/100`);
  }
  if (scores.depressionScore !== undefined) {
    lines.push(`  情绪状态分: ${scores.depressionScore}/24`);
  }
  if (scores.anxietyScore !== undefined) {
    lines.push(`  焦虑感受分: ${scores.anxietyScore}/21`);
  }
  if (scores.sleepQuality !== undefined) {
    lines.push(`  睡眠质量:   ${scores.sleepQuality}/100`);
  }
  lines.push('');

  lines.push('结果仅供参考，帮助你了解自己。');
  lines.push('═══════════════════════════════════════');

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportDataToJSON(data: unknown, _filename?: string) {
  const filename = _filename || 'self-backup';
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
