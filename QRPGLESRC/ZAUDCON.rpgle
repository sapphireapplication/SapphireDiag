000100100713     H*�--------------------------------------------------------------------    000200100713     H*�COPYRIGHT DATABOROUGH LTD 2010                                          000300100713     H*�--------------------------------------------------------------------    000400100713     H debug(*yes) copyright('Databorough Ltd. 2010') datedit(*dmy)             000500100713     H option(*srcstmt:*nodebugio:*showcpy)                                     000600100713     F**********************************************************************    000700100713     F*�F i l e s                                                               000800100713     F**********************************************************************    000900100713     Fconhdr    if   e           k disk                                         001000100713     Fcondet    if   e           k disk                                         001100100713     Fprojecl5a if   e           k disk                                         001200100713     Ftrnhstl6  if   e           k disk                                         001300100713     Fqsysprt   o    f  132        printer oflind(*INOF)                        001400100713                                                                                001500100713     D**********************************************************************    001600100713     D*�D e f i n i t i o n s                                                   001700100713     D**********************************************************************    001800100713     D projeccount     s              7p 0                                      001900100713     D trnhstcount     s              7p 0                                      002000100713     D tyme            s              6s 0                                      002100100713     D today           s              8s 0                                      002200100713                                                                                002300100713                                                                                002400100713     C**********************************************************************    002500100713     C*�M a i n l i n e   C o d e                                               002600100713     C**********************************************************************    002700100713      /free                                                                     002800100713        *inof = *on;                                                            002900100713       //�For each conhdr record                                                003000100713       setll *loval conhdrr;                                                    003100100713       read(e) conhdrr;                                                         003200100713       dow not %eof(conhdr);                                                    003300100713       projeccount = *zeros;                                                    003400100713       trnhstcount = *zeros;                                                    003500100713                                                                                003600100713       //�Count PROJECT records for XWORDN only                                 003700100713           setll conhdrk projecr;                                               003800100713           reade(e) conhdrk projecr;                                            003900100713           dow not %eof(projecl5a) and not %eof;                                004000100713               projeccount = projeccount + 1;                                   004001110914           //  trnhstcount = *zeros;                                            004100100713               reade(e) conhdrk projecr;                                        004200100713           enddo;                                                               004300100713                                                                                004400100713       //�Count TRNHST records                                                  004500100713           setll conhdrk trnhstr;                                               004600100713           reade(e) conhdrk trnhstr;                                            004700100713           dow not %eof(trnhstl6) and not %eof;                                 004800100713               trnhstcount = trnhstcount + 1;                                   004801110914           //  trnhstcount = *zeros;                                            004900100713               reade(e) conhdrk trnhstr;                                        005000100713           enddo;                                                               005100100713                                                                                005200100713       //�Output totals for Contract                                            005300100713          if *inof;                                                             005400100713             except headings;                                                   005500100713             *inof = *off;                                                      005501110914           //  trnhstcount = *zeros;                                            005600100713          endif;                                                                005700100713                                                                                005800100713          except contract;                                                      005900100713                                                                                006000100713                                                                                006100100713       //�Read associated condet records                                        006200100713       setll conhdrk condetr;                                                   006300100713       reade(e) conhdrk condetr;                                                006400100713       dow not %eof(condet);                                                    006500100713       projeccount = *zeros;                                                    006600100713       trnhstcount = *zeros;                                                    006700100713                                                                                006800100713       //�Count PROJECT records                                                 006900100713           setll condetk projecr;                                               007000100713           reade(e) condetk projecr;                                            007100100713           dow not %eof(projecl5a) and not %eof;                                007200100713               projeccount = projeccount + 1;                                   007201110914           //  trnhstcount = *zeros;                                            007300100713               reade(e) condetk projecr;                                        007400100713           enddo;                                                               007500100713                                                                                007600100713       //�Count TRNHST records                                                  007700100713           setll condetk trnhstr;                                               007800100713           reade(e) condetk trnhstr;                                            007900100713           dow not %eof(trnhstl6) and not %eof;                                 008000100713               trnhstcount = trnhstcount + 1;                                   008001110914           //  trnhstcount = *zeros;                                            008100100713               reade(e) condetk trnhstr;                                        008200100713           enddo;                                                               008300100713                                                                                008400100713       //�Output totals for Contract / Product                                  008500100713          if *inof;                                                             008600100713             except headings;                                                   008700100713             *inof = *off;                                                      008800100713          endif;                                                                008900100713                                                                                009000100713          except totals;                                                        009100100713                                                                                009200100713       reade(e) conhdrk condetr;                                                009300100713       enddo;                                                                   009400100713                                                                                009500100713       read(e) conhdrr;                                                         009600100713       enddo;                                                                   009700100713                                                                                009800100713       //�Terminate program and exit                                            009900100713       *inlr = *on;                                                             010000100713       return;                                                                  010100100713      /end-free                                                                 010200100713     C**********************************************************************    010300100713     C*�* I N Z S R                                                             010400100713     C**********************************************************************    010500100713     C     *inzsr        begsr                                                  010600100713     C                   time                    tyme                           010700100713     C                   z-add     *date         today                          010800100713     C     conhdrk       klist                                                  010900100713     C                   kfld                    xwordn                         011000100713     C     condetk       klist                                                  011100100713     C                   kfld                    xwordn                         011200100713     C                   kfld                    xwabcd                         011300100713     C                   endsr                                                  011400100713     Oqsysprt   e            headings       1 01                                011500100713     O                                           10 'X-Analysis'                011600100713     O                                           60 'Audit log for file: CONHDR'011700100713     O                                           69 '/ CONDET'                  011800100713     O                                          132 'Databorough LTD.'          011900100713     O          e            headings       1                                   012000100913     O                                           10 'ZAUDCON   '                012100100713     O                       tyme               120 '  :  :  '                  012200100713     O                       today              132 '  /  /    '                012300100713     O          e            headings       2                                   012400100713     O                                          127 'Page:'                     012500100713     O                       page          z    132                             012600100713     O          e            headings       1                                   012700100713     O                                           75 'PROJECT'                   012800100713     O                                           90 'TRNHST'                    012900100713     O          e            headings       2                                   013000100713     O                                           75 'Records'                   013100100713     O                                           90 'Records'                   013200100713     O          e            contract       2                                   013300100713     O                       xwordn        z      7                             013400100713     O                       projeccount   1     75                             013500100713     O                       trnhstcount   1     90                             013600100713     O          e            totals         2                                   013700100713     O                       xwordn        z      7                             013800100713     O                       xwabcd              30                             013900100713     O                       projeccount   1     75                             014000100713     O                       trnhstcount   1     90                             